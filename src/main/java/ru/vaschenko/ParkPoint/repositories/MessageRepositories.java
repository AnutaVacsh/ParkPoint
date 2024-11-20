package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.model.Message;

public interface MessageRepositories  extends JpaRepository<Message, Long> {
}
