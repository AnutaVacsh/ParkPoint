package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
}
