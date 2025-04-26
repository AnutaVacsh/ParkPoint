package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.RevParkingZone;

public interface RevParkingZoneRepository extends JpaRepository<RevParkingZone, Long> {
}
