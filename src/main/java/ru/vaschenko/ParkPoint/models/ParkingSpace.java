package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import lombok.*;
import ru.vaschenko.ParkPoint.enams.StateParkingSpace;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Data
@Table(name = "ParkingSpace")
public class ParkingSpace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_owner")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "id_parking_zone")
    @JsonBackReference
    private ParkingZone parkingZone;

    @Column(name = "\"order\"")
    private Integer order;

    @Column(name = "hourly_price")
    private Integer hourlyPrice;  // Цена в копейках

    @Column(name = "daily_price")
    private Integer dailyPrice;

    @Column(name = "weekly_price")
    private Integer weeklyPrice;

    @Column(name = "monthly_price")
    private Integer monthlyPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_available")
    private StateParkingSpace isAvailable;

    @Column(columnDefinition = "TEXT")
    private String description;
}
