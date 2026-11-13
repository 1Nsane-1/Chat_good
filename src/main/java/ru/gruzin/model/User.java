package ru.gruzin.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.gruzin.security.CryptoConverter;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String login;

    /** BCrypt-хэш пароля (односторонний). */
    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 30, columnDefinition = "varchar(30) default 'USER'")
    private String role = "USER";

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean banned = false;
    private Instant mutedUntil;
    @Column(nullable = false, columnDefinition = "integer default 1000")
    private int sparks = 1000;
    @Column(length = 80)
    private String equippedBadge;
    @Column(length = 40, columnDefinition = "varchar(40) default 'classic'")
    private String activeSkin = "classic";
    @Column(length = 500, columnDefinition = "varchar(500) default 'classic'")
    private String ownedSkins = "classic";
    @Column(length = 500, columnDefinition = "varchar(500) default ''")
    private String ownedRadios = "";

    // Часто нужные поля (зашифрованы AES-GCM)
    @Convert(converter = CryptoConverter.class) @Column(length = 4000) private String displayName;
    @Convert(converter = CryptoConverter.class) @Column(length = 4000) private String city;
    @Convert(converter = CryptoConverter.class) @Column(length = 4000) private String mood;

    /** Вся анкета одним JSON, целиком зашифрована AES-GCM. */
    @Convert(converter = CryptoConverter.class) @Column(length = 100000) private String profile;

    // Геопозиция не шифруется: по ней сервер считает расстояние и азимут
    private Double lat;
    private Double lon;
    private Instant locUpdated;

    public boolean isMutedNow() {
        return mutedUntil != null && mutedUntil.isAfter(Instant.now());
    }
}
