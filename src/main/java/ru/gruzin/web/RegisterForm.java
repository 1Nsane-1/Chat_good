package ru.gruzin.web;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterForm extends ProfileForm {
    @JsonIgnore
    @NotBlank(message = "Укажи логин")
    @Size(min = 3, max = 30, message = "От 3 до 30 символов")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Только латиница, цифры и _")
    private String login;

    @JsonIgnore
    @Size(min = 6, max = 72, message = "Пароль от 6 до 72 символов")
    private String password;
}
