package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Subscription;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByClientId(Long clientId);
}
