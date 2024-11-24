package ru.vaschenko.ParkPoint.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import ru.vaschenko.ParkPoint.type.Role;

@Builder
@Setter @Getter
public class AdminDTO{
    protected Long id;
    protected String email;
    protected Role role;
}
