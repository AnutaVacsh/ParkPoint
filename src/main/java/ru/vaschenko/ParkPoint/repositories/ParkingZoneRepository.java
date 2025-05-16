package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import ru.vaschenko.ParkPoint.models.ParkingZone;

import java.util.Arrays;
import java.util.List;

public interface ParkingZoneRepository extends JpaRepository<ParkingZone, Long>, JpaSpecificationExecutor<ParkingZone> {
    List<ParkingZone> findAllByState(StateParkingZone stateParkingZone);
}

