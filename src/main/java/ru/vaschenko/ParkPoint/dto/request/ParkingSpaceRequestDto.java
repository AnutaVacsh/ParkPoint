package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.enams.StateParkingSpace;

public record ParkingSpaceRequestDto(
        Long id,
        Long idOwner,
        Integer order,
        Integer hourlyPrice,
        Integer dailyPrice,
        Integer weeklyPrice,
        Integer monthlyPrice,
        StateParkingSpace isAvailable,
        String description,
        Long parkingZoneId
) {}