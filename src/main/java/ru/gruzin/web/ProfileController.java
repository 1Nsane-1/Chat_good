package ru.gruzin.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.gruzin.model.User;
import ru.gruzin.service.UserService;

@Controller
public class ProfileController {
    private final UserService users;

    public ProfileController(UserService users) { this.users = users; }

    @GetMapping("/profile")
    public String show(HttpServletRequest req, Model model) {
        User u = users.current(req.getSession(false)).orElseThrow();
        model.addAttribute("form", users.toForm(u));
        return "profile";
    }

    @PostMapping("/profile")
    public String save(@Valid @ModelAttribute("form") ProfileForm form, BindingResult br, HttpServletRequest req, Model model) {
        if (!br.hasFieldErrors("birthDate")) {
            String e = UserService.birthError(form.getBirthDate());
            if (e != null) br.rejectValue("birthDate", "bad", e);
        }
        if (br.hasErrors()) return "profile";
        User u = users.current(req.getSession(false)).orElseThrow();
        users.apply(u, form);
        users.save(u);
        model.addAttribute("saved", true);
        return "profile";
    }
}
