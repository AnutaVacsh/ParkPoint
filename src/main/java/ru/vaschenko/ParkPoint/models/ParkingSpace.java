package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@Table(name = "ParkingSpace")
public class ParkingSpace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_owner")
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "id_parking_zone")
    @JsonBackReference
    private ParkingZone parkingZone;

    @Column(name = "\"order\"")
    private Integer order;
    private Integer price;
    private Boolean isAvailable;
    private String description;

}
