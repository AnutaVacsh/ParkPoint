package ru.vaschenko.ParkPoint.models;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.Table;
import lombok.*;
import ru.vaschenko.ParkPoint.enams.Role;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@AllArgsConstructor
@Table(name = "Ownerr")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Owner extends User {
    private String phoneNumber;
}
