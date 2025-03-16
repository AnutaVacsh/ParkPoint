package ru.vaschenko.ParkPoint.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.*;
import ru.vaschenko.ParkPoint.enams.StateBooking;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "Booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id_parking_space")
    private ParkingSpace parkingSpace;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private LocalDateTime dateCreated = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private StateBooking status = StateBooking.PENDING;
}
