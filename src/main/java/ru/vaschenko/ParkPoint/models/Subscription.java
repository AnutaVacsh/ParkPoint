package ru.vaschenko.ParkPoint.models;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalTime;
import java.util.List;
import lombok.Data;

@Entity
@Table(name = "subscription")
@Data
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_parking_spase")
    private ParkingSpace parkingSpace;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @ElementCollection
    @CollectionTable(name = "subscription_days", joinColumns = @JoinColumn(name = "subscription_id"))
    private List<Integer> dayOfWeak;
    private LocalTime startTime;
    private LocalTime endTime;
}
