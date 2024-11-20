package ru.vaschenko.ParkPoint.repositories;

import org.hibernate.query.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.RevParkingZone;

public interface RevParkingZoneRepositories extends JpaRepository<RevParkingZone, Long> {
//    Page findByParkingZoneId(Long zoneId, Pageable pageable);
}
