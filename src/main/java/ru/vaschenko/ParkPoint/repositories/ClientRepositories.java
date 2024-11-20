package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.model.Client;

public interface ClientRepositories  extends JpaRepository<Client, Long> {
}
