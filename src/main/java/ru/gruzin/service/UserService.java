package ru.gruzin.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.gruzin.model.User;
import ru.gruzin.repo.UserRepository;
import ru.gruzin.web.ProfileForm;
import ru.gruzin.web.RegisterForm;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository users;
    private final ObjectMapper mapper;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository users, ObjectMapper mapper) {
        this.users = users;
        this.mapper = mapper;
    }

    public User register(RegisterForm f) {
        String login = f.getLogin().toLowerCase();
        if (login.startsWith("bot_")) throw new IllegalArgumentException("Логин не может начинаться с bot_");
        if (login.equals("1nsane_666")) throw new IllegalArgumentException("Этот логин зарезервирован администратором");
        if (users.existsByLogin(login)) throw new IllegalArgumentException("Такой логин уже занят");
        User u = new User();
        u.setLogin(login);
        u.setPasswordHash(encoder.encode(f.getPassword()));
        u.setRole("USER");
        u.setSparks(1000);
        apply(u, f);
        return users.save(u);
    }

    public Optional<User> login(String login, String password) {
        if (login == null || password == null) return Optional.empty();
        return users.findByLogin(login.trim().toLowerCase()).filter(u -> encoder.matches(password, u.getPasswordHash()));
    }

    public Optional<User> current(HttpSession session) {
        if (session == null) return Optional.empty();
        Object id = session.getAttribute("uid");
        return id instanceof Long l ? users.findById(l) : Optional.empty();
    }

    /** Записывает анкету: целиком в зашифрованный JSON + несколько быстрых полей. */
    public void apply(User u, ProfileForm f) {
        try {
            u.setProfile(mapper.writeValueAsString(f));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
        u.setDisplayName(f.getDisplayName().trim());
        u.setCity(f.getCity().trim());
        u.setMood(f.getMood());
    }

    public ProfileForm toForm(User u) {
        if (u.getProfile() == null) {
            ProfileForm f = new ProfileForm();
            f.setDisplayName(u.getDisplayName());
            f.setCity(u.getCity());
            f.setMood(u.getMood());
            return f;
        }
        try {
            return mapper.readValue(u.getProfile(), ProfileForm.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
    }

    public User save(User u) { return users.save(u); }

    public static String birthError(String s) {
        try {
            LocalDate d = LocalDate.parse(s);
            if (d.isAfter(LocalDate.now()) || d.isBefore(LocalDate.of(1900, 1, 1))) return "Проверь дату рождения";
            return null;
        } catch (Exception e) {
            return "Неверная дата";
        }
    }
}
