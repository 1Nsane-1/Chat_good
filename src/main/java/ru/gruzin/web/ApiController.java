package ru.gruzin.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.gruzin.model.Message;
import ru.gruzin.model.User;
import ru.gruzin.repo.MessageRepository;
import ru.gruzin.repo.UserRepository;
import ru.gruzin.service.BotService;
import ru.gruzin.service.UserService;
import ru.gruzin.util.GeoUtil;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApiController {

    record MessageDto(long id, String author, String authorLogin, String role, String badge, String emoji, String text,
                      long time, boolean mine, boolean bot, boolean authorBanned, boolean authorMuted,
                      Long replyId, String replyAuthor, String replyText) {}
    record SendReq(String text, String emoji, Long replyTo) {}
    record Loc(double lat, double lon) {}
    record Nearest(String name, double distance, double bearing, double lat, double lon) {}
    record Pin(String name, String mood, String city, double lat, double lon, boolean me) {}
    record ModActionReq(String login, boolean value, Integer minutes, String role) {}
    record UserAdminDto(String login, String displayName, String role, boolean banned, boolean muted, boolean bot) {}
    record SpinReq(int stake, int target, String targetName) {}
    record SpinRes(boolean won, double chance, int sparks, String equippedBadge) {}
    record ShopPurchaseReq(String id, int price) {}
    record ShopStateDto(int sparks, String activeSkin, List<String> ownedSkins, List<String> ownedRadios) {}

    private static final Set<String> FACES = Set.of("smile", "laugh", "love", "cool", "wink", "sleep");
    private static final Map<String, Integer> SKIN_PRICES = Map.of(
            "classic", 0,
            "cyber_teal", 350,
            "sakura_bloom", 450,
            "forest_zen", 600,
            "royal_gold", 900,
            "retro_vapor", 1200
    );
    private static final Map<String, Integer> RADIO_PRICES = Map.of(
            "radio_phonk", 200,
            "radio_lofi", 250,
            "radio_chill", 300,
            "radio_synthwave", 350,
            "radio_maximum", 400,
            "radio_ultra", 450,
            "radio_dfm", 500
    );

    private final UserService userService;
    private final UserRepository users;
    private final MessageRepository messages;
    private final BotService bots;
    private final Random rnd = new Random();

    public ApiController(UserService userService, UserRepository users, MessageRepository messages, BotService bots) {
        this.userService = userService;
        this.users = users;
        this.messages = messages;
        this.bots = bots;
    }

    private User me(HttpServletRequest req) {
        return userService.current(req.getSession(false))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private void requireAdmin(User me) {
        if (!"ADMIN".equals(me.getRole()) && !"1nsane_666".equals(me.getLogin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private void requireMod(User me) {
        if (!"ADMIN".equals(me.getRole()) && !"MODERATOR".equals(me.getRole()) && !"1nsane_666".equals(me.getLogin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static String cut(String s) { return s.length() > 80 ? s.substring(0, 80) + "…" : s; }

    private static List<String> splitCsv(String raw, String fallback) {
        String src = (raw == null || raw.isBlank()) ? fallback : raw;
        if (src == null || src.isBlank()) return new ArrayList<>();
        return Arrays.stream(src.split(",")).map(String::trim).filter(s -> !s.isEmpty())
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private ShopStateDto toShopState(User me) {
        List<String> skins = splitCsv(me.getOwnedSkins(), "classic");
        if (!skins.contains("classic")) skins.add(0, "classic");
        List<String> radios = splitCsv(me.getOwnedRadios(), "");
        String active = (me.getActiveSkin() == null || me.getActiveSkin().isBlank()) ? "classic" : me.getActiveSkin();
        return new ShopStateDto(me.getSparks(), active, skins, radios);
    }

    @GetMapping("/me/status")
    public Map<String, Object> myStatus(HttpServletRequest req) {
        User me = me(req);
        return Map.of("banned", me.isBanned(), "muted", me.isMutedNow(), "role", me.getRole());
    }

    @GetMapping("/messages")
    public List<MessageDto> messages(@RequestParam(defaultValue = "0") long after, HttpServletRequest req) {
        User me = me(req);
        bots.touch();

        List<Message> list;
        if (after <= 0) {
            list = new ArrayList<>(messages.findTop50ByOrderByIdDesc());
            Collections.reverse(list);
        } else {
            list = messages.findTop100ByIdGreaterThanOrderByIdAsc(after);
        }

        Set<Long> replyIds = list.stream().map(Message::getReplyToId).filter(Objects::nonNull).collect(Collectors.toSet());
        Map<Long, Message> replied = replyIds.isEmpty() ? Map.of()
                : messages.findAllById(replyIds).stream().collect(Collectors.toMap(Message::getId, m -> m));

        boolean isAdmin = "ADMIN".equals(me.getRole()) || "1nsane_666".equals(me.getLogin());
        return list.stream().filter(m -> isAdmin || !m.getAuthor().isBanned()).map(m -> {
            Message r = m.getReplyToId() == null ? null : replied.get(m.getReplyToId());
            return new MessageDto(
                    m.getId(), m.getAuthor().getDisplayName(), m.getAuthor().getLogin(),
                    m.getAuthor().getRole(), m.getAuthor().getEquippedBadge(),
                    m.getEmoji(), m.getText(), m.getCreatedAt().toEpochMilli(),
                    m.getAuthor().getId().equals(me.getId()), m.getAuthor().getLogin().startsWith("bot_"),
                    m.getAuthor().isBanned(), m.getAuthor().isMutedNow(),
                    r == null ? null : r.getId(), r == null ? null : r.getAuthor().getDisplayName(),
                    r == null ? null : cut(r.getText()));
        }).toList();
    }

    @PostMapping("/messages")
    public void send(@RequestBody SendReq body, HttpServletRequest req) {
        User me = me(req);
        if (me.isBanned() || me.isMutedNow()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Пользователь ограничен");
        String text = body.text() == null ? "" : body.text().trim();
        if (text.isEmpty() || text.length() > 500) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        Long replyTo = body.replyTo();
        if (replyTo != null && !messages.existsById(replyTo)) replyTo = null;

        Message m = new Message();
        m.setAuthor(me);
        m.setText(text);
        m.setEmoji(FACES.contains(body.emoji()) ? body.emoji() : "smile");
        m.setReplyToId(replyTo);
        messages.save(m);

        me.setSparks(me.getSparks() + 25);
        userService.save(me);
    }

    @DeleteMapping("/messages/{id}")
    public void deleteMessage(@PathVariable Long id, HttpServletRequest req) {
        User me = me(req);
        if (!"ADMIN".equals(me.getRole()) && !"MODERATOR".equals(me.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        messages.deleteById(id);
    }

    @GetMapping("/admin/users")
    public List<UserAdminDto> adminUsers(HttpServletRequest req) {
        requireAdmin(me(req));
        return users.findAll().stream()
                .map(u -> new UserAdminDto(u.getLogin(), u.getDisplayName(), u.getRole(), u.isBanned(), u.isMutedNow(), u.getLogin().startsWith("bot_")))
                .toList();
    }

    @PostMapping("/admin/ban")
    public void banUser(@RequestBody ModActionReq body, HttpServletRequest req) {
        requireAdmin(me(req));
        User target = users.findByLogin(body.login().toLowerCase()).orElseThrow();
        if ("1nsane_666".equals(target.getLogin())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        target.setBanned(body.value());
        userService.save(target);
    }

    @PostMapping("/admin/mute")
    public void muteUser(@RequestBody ModActionReq body, HttpServletRequest req) {
        requireMod(me(req));
        User target = users.findByLogin(body.login().toLowerCase()).orElseThrow();
        if ("1nsane_666".equals(target.getLogin())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        target.setMutedUntil(body.value() ? Instant.now().plus(Duration.ofMinutes(body.minutes() == null ? 15 : body.minutes())) : null);
        userService.save(target);
    }

    @PostMapping("/admin/role")
    public void setRole(@RequestBody ModActionReq body, HttpServletRequest req) {
        requireAdmin(me(req));
        User target = users.findByLogin(body.login().toLowerCase()).orElseThrow();
        if ("1nsane_666".equals(target.getLogin())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        target.setRole(body.role() == null ? "USER" : body.role().toUpperCase());
        userService.save(target);
    }

    @GetMapping("/shop/state")
    public ShopStateDto shopState(HttpServletRequest req) {
        return toShopState(me(req));
    }

    @PostMapping("/shop/buy-skin")
    public ShopStateDto buySkin(@RequestBody ShopPurchaseReq body, HttpServletRequest req) {
        User me = me(req);
        Integer price = SKIN_PRICES.get(body.id());
        if (price == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        LinkedHashSet<String> owned = new LinkedHashSet<>(splitCsv(me.getOwnedSkins(), "classic"));
        if (!owned.contains(body.id())) {
            if (me.getSparks() < price) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Недостаточно искр");
            me.setSparks(me.getSparks() - price);
            owned.add(body.id());
            me.setOwnedSkins(String.join(",", owned));
        }
        me.setActiveSkin(body.id());
        userService.save(me);
        return toShopState(me);
    }

    @PostMapping("/shop/apply-skin")
    public ShopStateDto applySkin(@RequestBody ShopPurchaseReq body, HttpServletRequest req) {
        User me = me(req);
        List<String> owned = splitCsv(me.getOwnedSkins(), "classic");
        if (!owned.contains(body.id()) && !"classic".equals(body.id())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        me.setActiveSkin(body.id());
        userService.save(me);
        return toShopState(me);
    }

    @PostMapping("/shop/buy-radio")
    public ShopStateDto buyRadio(@RequestBody ShopPurchaseReq body, HttpServletRequest req) {
        User me = me(req);
        Integer price = RADIO_PRICES.get(body.id());
        if (price == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        LinkedHashSet<String> owned = new LinkedHashSet<>(splitCsv(me.getOwnedRadios(), ""));
        if (!owned.contains(body.id())) {
            if (me.getSparks() < price) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Недостаточно искр");
            me.setSparks(me.getSparks() - price);
            owned.add(body.id());
            me.setOwnedRadios(String.join(",", owned));
            userService.save(me);
        }
        return toShopState(me);
    }

    @PostMapping("/shop/boost")
    public ShopStateDto boostSparks(HttpServletRequest req) {
        User me = me(req);
        if (me.getSparks() < 200) {
            me.setSparks(me.getSparks() + 200);
            userService.save(me);
        }
        return toShopState(me);
    }

    @GetMapping("/upgrader/state")
    public Map<String, Object> upgraderState(HttpServletRequest req) {
        User me = me(req);
        return Map.of("sparks", me.getSparks(), "equippedBadge", me.getEquippedBadge() == null ? "" : me.getEquippedBadge());
    }

    @PostMapping("/upgrader/spin")
    public SpinRes spinUpgrader(@RequestBody SpinReq body, HttpServletRequest req) {
        User me = me(req);
        if (body.stake() <= 0 || body.target() <= body.stake() || me.getSparks() < body.stake()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        double chance = Math.min(85.0, Math.max(5.0, ((double) body.stake() / body.target()) * 88.0));
        boolean won = (rnd.nextDouble() * 100.0) < chance;
        me.setSparks(me.getSparks() - body.stake() + (won ? body.target() : 0));
        if (won && body.targetName() != null && !body.targetName().isBlank()) {
            me.setEquippedBadge(body.targetName());
        }
        userService.save(me);
        return new SpinRes(won, Math.round(chance * 100.0) / 100.0, me.getSparks(), me.getEquippedBadge());
    }

    @PostMapping("/location")
    public void location(@RequestBody Loc loc, HttpServletRequest req) {
        if (Math.abs(loc.lat()) > 90 || Math.abs(loc.lon()) > 180) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        User me = me(req);
        me.setLat(loc.lat());
        me.setLon(loc.lon());
        me.setLocUpdated(Instant.now());
        userService.save(me);
    }

    @GetMapping("/nearest")
    public ResponseEntity<Nearest> nearest(HttpServletRequest req) {
        User me = me(req);
        if (me.getLat() == null) return ResponseEntity.noContent().build();
        return users.findByLatIsNotNullAndLocUpdatedAfter(Instant.now().minus(Duration.ofHours(24))).stream()
                .filter(u -> !u.getId().equals(me.getId()))
                .min(Comparator.comparingDouble(u -> GeoUtil.distance(me.getLat(), me.getLon(), u.getLat(), u.getLon())))
                .map(u -> ResponseEntity.ok(new Nearest(u.getDisplayName(),
                        GeoUtil.distance(me.getLat(), me.getLon(), u.getLat(), u.getLon()),
                        GeoUtil.bearing(me.getLat(), me.getLon(), u.getLat(), u.getLon()),
                        u.getLat(), u.getLon())))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/locations")
    public List<Pin> locations(HttpServletRequest req) {
        User me = me(req);
        return users.findByLatIsNotNullAndLocUpdatedAfter(Instant.now().minus(Duration.ofHours(24))).stream()
                .map(u -> new Pin(u.getDisplayName(), u.getMood(), u.getCity(), u.getLat(), u.getLon(), u.getId().equals(me.getId())))
                .toList();
    }
}
