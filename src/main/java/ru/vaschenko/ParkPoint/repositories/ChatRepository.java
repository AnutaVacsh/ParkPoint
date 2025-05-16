package ru.vaschenko.ParkPoint.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.vaschenko.ParkPoint.models.Chat;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByOwnerIdOrClientId(Long userId, Long userId1);

    @Query(value = "SELECT * FROM Chat c WHERE (c.id_owner = :userId1 AND c.id_client = :userId2) OR (c.id_owner = :userId2 AND c.id_client = :userId1)", nativeQuery = true)
    Chat findByUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
