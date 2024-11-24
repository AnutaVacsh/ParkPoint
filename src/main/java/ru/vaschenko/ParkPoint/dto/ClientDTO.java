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
public class ClientDTO{
    protected Long id;
    protected Role role;
    protected String email;
    protected String phoneNumber;
}
