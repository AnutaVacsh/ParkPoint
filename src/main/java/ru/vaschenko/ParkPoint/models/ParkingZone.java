package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Data
@Table(name = "ParkingZone")
public class ParkingZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_zone_manager")
    private User zoneManager;

    private String title;
    private String address;
    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    private StateParkingZone state;
    private String description;
    private String map;

    @OneToMany(mappedBy = "parkingZone", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ParkingSpace> parkingSpaces;

    @OneToMany(mappedBy = "parkingZone", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Photo> photos;

    @OneToMany(mappedBy = "parkingZone", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<RevParkingZone> rev;

}