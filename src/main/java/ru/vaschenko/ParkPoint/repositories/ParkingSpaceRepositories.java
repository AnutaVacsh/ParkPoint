package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.ParkingSpace;

import java.util.List;

public interface ParkingSpaceRepositories extends JpaRepository<ParkingSpace, Long> {
    List<ParkingSpace> findByParkingZoneId(Long zoneId);
}
