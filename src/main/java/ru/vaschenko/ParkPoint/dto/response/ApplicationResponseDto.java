package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.enams.ApplicationStatus;

public record ApplicationResponseDto(
        Long id,
        String email,
        String emailText,
        String title,
        String address,
        Double latitude,
        Double longitude,
        String description,
        ApplicationStatus status
) {
}