package ru.vaschenko.ParkPoint.dto.response;

import java.time.LocalDateTime;

public record TimeSlotDto(
        LocalDateTime startTime,
        LocalDateTime endTime
) {}
