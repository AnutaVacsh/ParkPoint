package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.vaschenko.ParkPoint.models.Application;

public interface ApplicationRepository  extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {
    Page<Application> findByTitleContainingIgnoreCaseOrEmailContainingIgnoreCase(String filter, String filter1, Pageable pageable);
}
