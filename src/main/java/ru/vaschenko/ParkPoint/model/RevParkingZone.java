package ru.vaschenko.ParkPoint.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
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

//    @OneToOne
//    @JoinColumn(name = "id_photo")
//    private Photo photo;

    // Getters and Setters
}
