package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.model.Photo;

public interface PhotoRepositories extends JpaRepository<Photo, Long> {
}
