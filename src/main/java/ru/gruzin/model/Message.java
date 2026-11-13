package ru.gruzin.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.gruzin.security.CryptoConverter;

import java.time.Instant;

@Entity
@Table(name = "messages")
@Getter @Setter @NoArgsConstructor
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User author;

    @Convert(converter = CryptoConverter.class)
    @Column(length = 4000, nullable = false)
    private String text;

    /** Ключ «лица» настроения: smile, laugh, love, cool, wink, sleep. */
    private String emoji;

    /** id сообщения, на которое это - ответ (как в Telegram). */
    private Long replyToId;

    private Instant createdAt = Instant.now();
}
