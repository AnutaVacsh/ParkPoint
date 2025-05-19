package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.models.User;

public record ComplaintRequestDto(
        Long complainantId,
        Long accusedId,
        String text,
        Long bookingId
) {}
