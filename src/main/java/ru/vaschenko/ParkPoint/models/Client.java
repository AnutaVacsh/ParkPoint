package ru.vaschenko.ParkPoint.models;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.*;
import ru.vaschenko.ParkPoint.enams.Role;

@Getter
@Setter
@ToString
@Entity
@AllArgsConstructor
@Table(name = "client")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Client extends User{
    private String phoneNumber;
}
