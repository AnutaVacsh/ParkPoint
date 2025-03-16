package ru.vaschenko.ParkPoint.dto.request;

import java.time.LocalTime;
import java.util.List;

public record SubscriptionRequestDto(
        Long parkingSpaceId,
        Long clientId,
        List<Integer> dayOfWeak,
        LocalTime startTime,
        LocalTime endTime
) {}
