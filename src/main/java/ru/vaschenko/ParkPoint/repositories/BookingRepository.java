package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}

