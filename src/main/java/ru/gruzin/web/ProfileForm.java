package ru.gruzin.web;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

/** Анкета пользователя. Хранится в БД одним зашифрованным JSON. */
@Getter @Setter
public class ProfileForm {
    private static final String M = "Заполни поле";

    // --- как обращаться ---
    @NotBlank(message = M) @Size(max = 40) private String displayName;
    @NotBlank(message = M) @Size(max = 50) private String lastName;
    @NotBlank(message = M) @Size(max = 50) private String firstName;
    @Size(max = 50) private String middleName;

    // --- контакты ---
    @NotBlank(message = M) @Email(message = "Неверный email") @Size(max = 100) private String email;
    @NotBlank(message = M) @Pattern(regexp = "^[+0-9()\\- ]{6,20}$", message = "Неверный телефон") private String phone;

    // --- анкета ---
    @NotBlank(message = M) private String gender;
    @NotBlank(message = M) @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Укажи дату") private String birthDate;
    @NotBlank(message = M) @Size(max = 100) private String birthPlace;
    @NotBlank(message = M) @Size(max = 100) private String city;
    @NotBlank(message = M) private String maritalStatus;
    @NotBlank(message = M) private String hasChildren;
    @NotBlank(message = M) private String education;

    // --- внешность ---
    @NotNull(message = M) @Min(value = 80, message = "От 80") @Max(value = 250, message = "До 250") private Integer height;
    @NotNull(message = M) @DecimalMin(value = "20", message = "От 20") @DecimalMax(value = "400", message = "До 400") private Double weight;
    @NotBlank(message = M) private String eyeColor;
    @NotBlank(message = M) private String hairColor;
    @NotBlank(message = M) private String bodyType;

    // --- характер ---
    @NotBlank(message = M) @Size(max = 200) private String character;
    @NotBlank(message = M) private String temperament;
    @NotBlank(message = M) private String humor;
    @NotBlank(message = M) private String mood;
    @NotBlank(message = M) @Size(max = 100) private String dream;
    @NotBlank(message = M) @Size(max = 100) private String valuesMost;
    @NotBlank(message = M) @Size(max = 100) private String hateMost;

    // --- привычки и вкусы ---
    @NotBlank(message = M) private String smoking;
    @NotBlank(message = M) private String alcohol;
    @NotBlank(message = M) @Size(max = 100) private String favFood;
    @NotBlank(message = M) private String likeCooking;
    @NotBlank(message = M) @Size(max = 100) private String favDrink;
    @NotBlank(message = M) @Size(max = 100) private String restType;
    @NotBlank(message = M) @Size(max = 100) private String hobby;
    @NotBlank(message = M) @Size(max = 100) private String favAnimal;
    @Size(max = 50) private String petName;
    @NotBlank(message = M) @Size(max = 100) private String favMusic;
    @NotBlank(message = M) @Size(max = 100) private String favMovie;
    @NotBlank(message = M) @Size(max = 100) private String favLiterature;
    @NotBlank(message = M) private String favSeason;
    @NotBlank(message = M) @Size(max = 100) private String favColor;
    @Size(max = 100) private String favRadio;
    @NotBlank(message = M) @Size(max = 100) private String superpower;
    @NotBlank(message = M) @Size(max = 100) private String happyThing;
    @Size(max = 500, message = "Не больше 500 символов") private String aboutMe;
}
