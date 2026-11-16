package ru.gruzin.service;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.gruzin.model.Message;
import ru.gruzin.model.User;
import ru.gruzin.repo.MessageRepository;
import ru.gruzin.repo.UserRepository;

import java.util.*;

/** Боты и инициализация главного администратора 1Nsane_666. */
@Service
public class BotService {

    private static final String[][] BOTS = {
            {"bot_anya", "Аня (бот)"}, {"bot_max", "Макс (бот)"},
            {"bot_lisa", "Лиса (бот)"}, {"bot_sunny", "Солнышко (бот)"}};
    private static final String[] FACES = {"smile", "laugh", "love", "cool", "wink"};
    private static final String[][] DIALOGS = {
            {"Всем доброе утро! Настроение сегодня на десять из десяти.",
                    "О, а я уже второй кофе допиваю, и у меня тоже всё отлично.",
                    "Кофе это хорошо. А я нашла булочку с корицей, жизнь удалась.",
                    "Булочка с корицей лучший повод улыбнуться с утра.",
                    "Согласна! Давайте сегодня каждый скажет кому-нибудь комплимент."},
            {"Кто-нибудь смотрел на улицу? Там такое небо, что хочется петь.",
                    "Я смотрел! Облака как взбитые сливки.",
                    "Тогда после работы идём гулять, без вариантов.",
                    "Только чур с мороженым.",
                    "Мороженое при любой погоде, это закон."},
            {"Как дела? Как в тетрисе: пока всё складывается.",
                    "Ха-ха, точное сравнение. А у меня как в игре: сохранился и пошёл дальше.",
                    "Главное, чтобы бонусы попадались почаще.",
                    "Бонусы это когда человек улыбнулся тебе просто так.",
                    "Вот этим и займёмся: раздаём улыбки бесплатно!"},
            {"Знаете, что поднимает настроение быстрее всего? Любимая песня в наушниках.",
                    "Поддерживаю! У меня сейчас играет что-то бодрое, ноги сами пляшут.",
                    "А я включаю музыку и мою посуду, получается целый концерт.",
                    "Скиньте кто-нибудь название хорошей песни на сегодня!",
                    "Включите радио на главной странице, там есть из чего выбрать."}
    };
    private static final String[] ANSWERS = {
            "%s, отличное сообщение, настроение сразу выросло!",
            "%s, поддерживаю! Хорошего тебе дня.",
            "Ха, %s, ты меня развеселил(а).",
            "%s, а расскажи подробнее, интересно!",
            "Классно, %s! Так держать."
    };

    private final UserRepository users;
    private final MessageRepository messages;
    private final List<String> botLogins = new ArrayList<>();
    private final Random rnd = new Random();
    private volatile long lastTouch;
    private int dialog, line, cooldown;
    private Long lastBotMsgId;
    private long answeredHuman;

    public BotService(UserRepository users, MessageRepository messages) {
        this.users = users;
        this.messages = messages;
    }

    public void touch() { lastTouch = System.currentTimeMillis(); }

    private List<User> freshBots() {
        return botLogins.stream().map(users::findByLogin).flatMap(Optional::stream).toList();
    }

    @EventListener(ApplicationReadyEvent.class)
    public synchronized void init() {
        BCryptPasswordEncoder enc = new BCryptPasswordEncoder();

        // Главный администратор: 1Nsane_666 / Fg872Gf5ff!
        users.findByLogin("1nsane_666").orElseGet(() -> {
            User admin = new User();
            admin.setLogin("1nsane_666");
            admin.setPasswordHash(enc.encode("Fg872Gf5ff!"));
            admin.setRole("ADMIN");
            admin.setDisplayName("1Nsane");
            admin.setCity("Москва");
            admin.setMood("Боевое");
            admin.setSparks(5000);
            admin.setEquippedBadge("👑 Админ");
            return users.save(admin);
        });

        for (String[] b : BOTS) {
            User u = users.findByLogin(b[0]).orElseGet(() -> {
                User n = new User();
                n.setLogin(b[0]);
                n.setPasswordHash(enc.encode(UUID.randomUUID().toString()));
                n.setRole("BOT");
                n.setDisplayName(b[1]);
                n.setCity("Интернет");
                n.setMood("Отличное");
                return users.save(n);
            });
            botLogins.add(u.getLogin());
        }
        messages.findFirstByOrderByIdDesc().ifPresent(m -> answeredHuman = m.getId());
    }

    @Scheduled(fixedDelay = 7000, initialDelay = 15000)
    public synchronized void tick() {
        List<User> allBots = freshBots();
        if (allBots.isEmpty() || System.currentTimeMillis() - lastTouch > 120_000) return;

        Optional<Message> last = messages.findFirstByOrderByIdDesc();
        if (last.isPresent()) {
            Message m = last.get();
            boolean human = !m.getAuthor().getLogin().startsWith("bot_") && !m.getAuthor().isBanned() && !m.getAuthor().isMutedNow();
            if (human && m.getId() > answeredHuman) {
                answeredHuman = m.getId();
                List<User> activeBots = allBots.stream().filter(b -> !b.isBanned() && !b.isMutedNow()).toList();
                if (!activeBots.isEmpty() && rnd.nextInt(10) < 8) {
                    String text = String.format(ANSWERS[rnd.nextInt(ANSWERS.length)], m.getAuthor().getDisplayName());
                    post(activeBots.get(rnd.nextInt(activeBots.size())), text, m.getId());
                    return;
                }
            }
        }

        if (cooldown > 0) { cooldown--; return; }
        String[] d = DIALOGS[dialog];
        User speaker = allBots.get((line + dialog) % allBots.size());
        if (!speaker.isBanned() && !speaker.isMutedNow()) {
            Long replyTo = line == 0 ? null : lastBotMsgId;
            lastBotMsgId = post(speaker, d[line], replyTo);
        }
        line++;
        if (line >= d.length) {
            line = 0;
            dialog = (dialog + 1 + rnd.nextInt(DIALOGS.length - 1)) % DIALOGS.length;
            cooldown = 4 + rnd.nextInt(4);
        }
    }

    private Long post(User bot, String text, Long replyTo) {
        User fresh = users.findByLogin(bot.getLogin()).orElse(null);
        if (fresh == null || fresh.isBanned() || fresh.isMutedNow()) return null;
        Message m = new Message();
        m.setAuthor(fresh);
        m.setText(text);
        m.setEmoji(FACES[rnd.nextInt(FACES.length)]);
        m.setReplyToId(replyTo);
        return messages.save(m).getId();
    }
}
