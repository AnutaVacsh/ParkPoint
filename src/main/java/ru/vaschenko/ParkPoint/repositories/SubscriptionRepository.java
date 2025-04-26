package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.vaschenko.ParkPoint.models.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
}
