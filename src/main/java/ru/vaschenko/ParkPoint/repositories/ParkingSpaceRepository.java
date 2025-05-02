package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import ru.vaschenko.ParkPoint.models.ParkingSpace;

import java.util.List;

public interface ParkingSpaceRepository extends JpaRepository<ParkingSpace, Long> {
    List<ParkingSpace> findByParkingZoneId(Long parkingZoneId);
}
