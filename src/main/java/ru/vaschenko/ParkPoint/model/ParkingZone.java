package ru.vaschenko.ParkPoint.model;

import jakarta.persistence.*;
import lombok.*;
import ru.vaschenko.ParkPoint.type.StateParkingZone;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "ParkingZone")
public class ParkingZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_owner")
    private Owner owner;

    private String title;
    private String address;
    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    private StateParkingZone state;

    private String description;

    @OneToMany(mappedBy = "parkingZone", cascade = CascadeType.ALL)
    private List<ParkingSpace> parkingSpaces;

    @OneToMany(mappedBy = "parkingZone", cascade = CascadeType.ALL)
    private List<Photo> photos;
}