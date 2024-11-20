package ru.vaschenko.ParkPoint.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.*;
import ru.vaschenko.ParkPoint.type.Role;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "Adminn")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Admin extends User{
}
