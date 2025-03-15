package ru.vaschenko.ParkPoint.models;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@Entity
@Table(name = "Adminn")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Admin extends User{
}
