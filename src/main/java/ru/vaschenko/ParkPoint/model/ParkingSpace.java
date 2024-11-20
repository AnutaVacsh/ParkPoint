package ru.vaschenko.ParkPoint.model;

import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "ParkingSpace")
public class ParkingSpace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_parking_zone")
    private ParkingZone parkingZone;

    private Integer order;
    private Integer price;
    private Boolean isAvailable;
    private String description;

}
