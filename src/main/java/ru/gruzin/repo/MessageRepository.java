package ru.gruzin.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.gruzin.model.Message;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findTop50ByOrderByIdDesc();
    List<Message> findTop100ByIdGreaterThanOrderByIdAsc(Long id);
    Optional<Message> findFirstByOrderByIdDesc();
}
