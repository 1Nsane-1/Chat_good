package ru.gruzin.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.gruzin.model.User;
import ru.gruzin.service.UserService;

import java.util.Optional;

@Controller
public class AuthController {
    private final UserService users;

    public AuthController(UserService users) { this.users = users; }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("form", new RegisterForm());
        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("form") RegisterForm form, BindingResult br, HttpServletRequest req) {
        if (!br.hasFieldErrors("birthDate")) {
            String e = UserService.birthError(form.getBirthDate());
            if (e != null) br.rejectValue("birthDate", "bad", e);
        }
        if (br.hasErrors()) return "register";
        try {
            User u = users.register(form);
            startSession(req, u);
            return "redirect:/chat";
        } catch (IllegalArgumentException e) {
            br.rejectValue("login", "dup", e.getMessage());
            return "register";
        }
    }

    @GetMapping("/login")
    public String loginForm() { return "login"; }

    @PostMapping("/login")
    public String login(@RequestParam String login, @RequestParam String password, HttpServletRequest req, Model model) {
        Optional<User> u = users.login(login, password);
        if (u.isEmpty()) {
            model.addAttribute("error", "Неверный логин или пароль");
            return "login";
        }
        startSession(req, u.get());
        return "redirect:/chat";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    private void startSession(HttpServletRequest req, User u) {
        HttpSession s = req.getSession();
        req.changeSessionId();
        s.setAttribute("uid", u.getId());
    }
}
