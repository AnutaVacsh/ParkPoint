package ru.vaschenko.ParkPoint.dto;

public record UserCardDto(
        Long userId,
        byte[] encryptedCard,
        String last4,
        String expirationDate
) {}
