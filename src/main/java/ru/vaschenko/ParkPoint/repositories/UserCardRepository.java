package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.UserCard;

public interface UserCardRepository extends JpaRepository<UserCard, Long> {
}
