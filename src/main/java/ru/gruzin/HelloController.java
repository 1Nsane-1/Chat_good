package ru.gruzin;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.gruzin.repo.MessageRepository;
import ru.gruzin.repo.UserRepository;
import ru.gruzin.service.UserService;

@Controller
public class HelloController {

    private final UserRepository users;
    private final MessageRepository messages;
    private final UserService userService;

    public HelloController(UserRepository users, MessageRepository messages, UserService userService) {
        this.users = users;
        this.messages = messages;
        this.userService = userService;
    }

    @GetMapping("/")
    public String home(Model model, HttpServletRequest req) {
        model.addAttribute("usersCount", users.count());
        model.addAttribute("msgCount", messages.count());
        String fav = userService.current(req.getSession(false))
                .map(u -> userService.toForm(u).getFavRadio()).orElse("");
        model.addAttribute("favRadio", fav == null ? "" : fav);
        return "hello";
    }

    @GetMapping("/chat")     public String chat()     { return "chat"; }
    @GetMapping("/shop")     public String shop()     { return "shop"; }
    @GetMapping("/map")      public String map()      { return "map"; }
    @GetMapping("/compass")  public String compass()  { return "compass"; }
    @GetMapping("/calc")     public String calc()     { return "calc"; }
    @GetMapping("/upgrader") public String upgrader() { return "upgrader"; }
}
