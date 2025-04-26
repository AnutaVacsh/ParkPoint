package ru.vaschenko.ParkPoint.dto;

import ru.vaschenko.ParkPoint.enams.StateParkingSpace;

public record ParkingSpaceDto(
        Long id,
        Long idOwner,
        Integer order,
        Integer hourlyPrice,
        Integer dailyPrice,
        Integer weeklyPrice,
        Integer monthlyPrice,
        StateParkingSpace isAvailable,
        String description,
        ParkingZoneDto parkingZoneDto
) {}
