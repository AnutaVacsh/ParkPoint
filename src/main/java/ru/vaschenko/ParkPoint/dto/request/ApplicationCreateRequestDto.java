package ru.vaschenko.ParkPoint.dto.request;

public record ApplicationCreateRequestDto(
        String email,
        String emailText,
        String title,
        String address,
        Double latitude,
        Double longitude,
        String description
) {
}
