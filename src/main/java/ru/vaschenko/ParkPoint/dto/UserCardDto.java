package ru.vaschenko.ParkPoint.dto;

public record UserCardDto(
        Long UserId,
        byte[] encryptedCard,
        String last4,
        String expirationDate
) {}
