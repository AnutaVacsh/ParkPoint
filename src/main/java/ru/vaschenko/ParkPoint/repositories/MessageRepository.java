package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
