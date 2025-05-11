package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.vaschenko.ParkPoint.models.ParkingZone;

public interface ParkingZoneRepository extends JpaRepository<ParkingZone, Long>, JpaSpecificationExecutor<ParkingZone> {
}

