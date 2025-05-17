package ru.vaschenko.ParkPoint.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record SubscriptionDto(
        Long id,
        ParkingSpaceDto parkingSpace,
        UserDto client,
        List<Integer> dayOfWeak,
        LocalTime startTime,
        LocalTime endTime,
        Integer price,
        LocalDateTime createTime
) {
}
