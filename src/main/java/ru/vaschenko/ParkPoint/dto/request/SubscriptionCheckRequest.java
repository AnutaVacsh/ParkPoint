package ru.vaschenko.ParkPoint.dto.request;

import java.time.LocalTime;
import java.util.List;

public record SubscriptionCheckRequest(
        Long parkingSpaceId,
        List<Integer> dayOfWeak,
        LocalTime startTime,
        LocalTime endTime
) {
}