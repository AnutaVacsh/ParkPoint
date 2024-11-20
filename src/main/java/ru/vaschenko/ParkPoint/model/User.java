package ru.vaschenko.ParkPoint.model;

import jakarta.persistence.*;
import lombok.*;
import ru.vaschenko.ParkPoint.type.Role;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "Userr")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    protected String email;

    @ManyToOne
    @JoinColumn(name = "id_password")
    protected Password password;

    @Enumerated(EnumType.STRING)
    protected Role role;
}

