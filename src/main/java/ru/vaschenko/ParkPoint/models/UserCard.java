package ru.vaschenko.ParkPoint.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jdk.jfr.Enabled;
import lombok.Data;

import java.time.LocalDateTime;

@Enabled
@Table(name = "userCard")
@Data
public class UserCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private User client;

    @Lob
    @Column(name = "encrypted_card")
    private byte[] encryptedCard;

    @Column(name = "last4")
    private String last4;

    @Column(name = "expiration_date")
    private String expirationDate;

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();
}
