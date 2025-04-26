package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Password;

public interface PasswordRepository extends JpaRepository<Password, Long> {
}
