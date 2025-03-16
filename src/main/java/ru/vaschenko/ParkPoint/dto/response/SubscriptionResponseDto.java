package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;

import java.time.LocalTime;
import java.util.List;

public record SubscriptionResponseDto(
        ParkingSpaceDto parkingSpace,
        List<Integer> dayOfWeak,
        LocalTime startTime,
        LocalTime endTime
) {}
