package ru.vaschenko.ParkPoint.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "RevParkingZone")
public class RevParkingZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_parking_zone")
    private ParkingZone parkingZone;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    private String comment;
    private Integer rating;
}
