package ru.vaschenko.ParkPoint.dto.request;

import java.time.LocalDateTime;

public record UserStatsDto(
        int users,
        int owners
) {
}
