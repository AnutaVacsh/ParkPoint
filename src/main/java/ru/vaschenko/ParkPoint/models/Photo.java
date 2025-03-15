package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@Table(name = "Photo")
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_parking_zone")
    @JsonBackReference
    private ParkingZone parkingZone;

    private Integer order;
    private String photoUrl;

}
