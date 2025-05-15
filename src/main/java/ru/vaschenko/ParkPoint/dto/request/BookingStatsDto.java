package ru.vaschenko.ParkPoint.dto.request;

import java.time.LocalDateTime;

public record BookingStatsDto(
        LocalDateTime date,
        int sent,
        int confirmed
) {
}
