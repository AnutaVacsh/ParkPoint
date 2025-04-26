package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
