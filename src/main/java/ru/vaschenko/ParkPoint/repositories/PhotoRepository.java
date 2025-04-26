package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Photo;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
}
