package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.model.ParkingZone;

public interface ParkingZoneRepositories extends JpaRepository<ParkingZone, Long> {
}
