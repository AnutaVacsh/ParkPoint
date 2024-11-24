package ru.vaschenko.ParkPoint.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.type.Role;

@Builder
@Setter
@Getter
public class SafeUserRequestDTO {
    protected Long id;
    protected PasswordDTO passwordDTO;
    protected Role role;
    protected String email;
    private String phoneNumber;
}
