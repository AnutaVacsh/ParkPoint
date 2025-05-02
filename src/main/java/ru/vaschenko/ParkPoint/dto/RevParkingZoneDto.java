package ru.vaschenko.ParkPoint.dto;

import java.time.LocalDateTime;

public record RevParkingZoneDto(
        Long id,
//        ParkingZoneDto parkingZone,
        UserDto client,
        String comment,
        Integer rating,
        LocalDateTime createdAt
) {
    public RevParkingZoneDto{
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
