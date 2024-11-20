package ru.vaschenko.ParkPoint.dto;
import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.Accessors;
import ru.vaschenko.ParkPoint.type.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

//@Builder
//@Setter @Getter
//@Accessors(chain = true)
public abstract class UserDTO {
    protected Long id;
    protected String email;
    protected String role; //ADMIN, OWNER, CLIENT
}
