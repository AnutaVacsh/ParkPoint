package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.ParkingZone;

public interface ParkingZoneRepository extends JpaRepository<ParkingZone, Long> {
}
