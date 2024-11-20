package ru.vaschenko.ParkPoint.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.Table;
import lombok.*;
import ru.vaschenko.ParkPoint.type.Role;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "Ownerr")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Owner extends User {
    private String phoneNumber;

    public Owner(Long id, String email, Password password, Role role, String phoneNumber) {
        super(id, email, password, role);
        this.phoneNumber = phoneNumber;
    }
}
