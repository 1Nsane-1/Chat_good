package ru.gruzin.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ru.gruzin.model.User;
import ru.gruzin.service.UserService;

@Configuration
@EnableScheduling
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
                HttpSession s = req.getSession(false);
                if (s != null && s.getAttribute("uid") != null) return true;
                if (req.getRequestURI().startsWith("/api/")) res.sendError(401);
                else res.sendRedirect("/login");
                return false;
            }
        }).addPathPatterns("/chat", "/shop", "/map", "/compass", "/calc", "/upgrader", "/profile", "/api/**");
    }

    @ControllerAdvice(annotations = Controller.class)
    static class Globals {
        private final UserService users;
        private final String yandexKey;

        Globals(UserService users, @Value("${app.yandex.key:}") String yandexKey) {
            this.users = users;
            this.yandexKey = yandexKey;
        }

        @ModelAttribute("me")
        User me(HttpServletRequest req) { return users.current(req.getSession(false)).orElse(null); }

        @ModelAttribute("favRadio")
        String favRadio(HttpServletRequest req) {
            return users.current(req.getSession(false))
                    .map(u -> users.toForm(u).getFavRadio())
                    .orElse("");
        }

        @ModelAttribute("yandexKey")
        String yandexKey() { return yandexKey; }
    }
}
