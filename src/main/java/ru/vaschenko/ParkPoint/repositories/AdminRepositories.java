package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.model.Admin;

public interface AdminRepositories extends JpaRepository<Admin, Long> {
}
