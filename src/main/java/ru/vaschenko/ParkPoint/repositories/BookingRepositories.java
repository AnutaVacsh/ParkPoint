package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.util.List;

public interface BookingRepositories extends JpaRepository<Booking, Long> {
//    List<Booking> findByStatus(StateBooking status);
    Page<Booking> findByStatus(StateBooking status, Pageable pageable);
    List<Booking> findByClientId(Long clientId);
    List<Booking> findByParkingSpace_ParkingZone_OwnerId(Long ownerId);
    List<Booking> findByParkingSpaceId(Long parkingSpaceId);
    boolean existsByClientId(Long clientId);
    boolean existsByParkingSpace_ParkingZone_OwnerId(Long ownerId);
    boolean existsByParkingSpaceId(Long parkingSpaceId);
}
