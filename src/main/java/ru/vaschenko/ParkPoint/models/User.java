package ru.vaschenko.ParkPoint.models;

import jakarta.persistence.*;
import lombok.*;
import ru.vaschenko.ParkPoint.enams.Role;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Userr")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    protected String email;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_password")
    protected Password password;

    @Enumerated(EnumType.STRING)
    protected Role role;
}

