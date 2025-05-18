package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.vaschenko.ParkPoint.enams.ApplicationStatus;

import java.util.List;

@Entity
@Table(name = "application")
@Getter
@Setter
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @Column(name = "email_text", columnDefinition = "TEXT")
    private String emailText;

    private String title;
    private String address;
    private Double latitude;
    private Double longitude;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.UNVIEWED;
}

