package ru.vaschenko.ParkPoint.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "Password")
public class Password {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String password;
}
