package ru.vaschenko.ParkPoint.dto.request;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record SubscriptionCreateRequestDto(
        Long parkingSpaceId,
        Long clientId,
        List<Integer> dayOfWeak,
        LocalTime startTime,
        LocalTime endTime,
        Integer price,
        LocalDateTime createTime
) {
}
