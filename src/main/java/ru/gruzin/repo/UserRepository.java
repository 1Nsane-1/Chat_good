package ru.gruzin.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.gruzin.model.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLogin(String login);
    boolean existsByLogin(String login);
    List<User> findByLatIsNotNullAndLocUpdatedAfter(Instant since);
}
