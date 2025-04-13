package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "RevParkingZone")
public class RevParkingZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_parking_zone")
    @JsonBackReference
    private ParkingZone parkingZone;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private User client;

    private String comment;
    private Integer rating;

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();
}
