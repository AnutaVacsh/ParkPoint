package ru.vaschenko.ParkPoint.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.vaschenko.ParkPoint.type.Role;

@Builder
@Setter @Getter
public class OwnerDTO{
    protected Long id;
    protected Role role;
    protected String email;
    protected String phoneNumber;
}
