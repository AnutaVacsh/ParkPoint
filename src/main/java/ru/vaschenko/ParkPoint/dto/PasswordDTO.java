package ru.vaschenko.ParkPoint.dto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class PasswordDTO {
    protected long id;
    protected String password;
}
