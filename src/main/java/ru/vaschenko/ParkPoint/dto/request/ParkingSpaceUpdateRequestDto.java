package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.enams.StateParkingSpace;

public record ParkingSpaceUpdateRequestDto(
        Long id,
        Integer order,
        Integer hourlyPrice,
        Integer dailyPrice,
        Integer weeklyPrice,
        Integer monthlyPrice,
        String description
) {
}
