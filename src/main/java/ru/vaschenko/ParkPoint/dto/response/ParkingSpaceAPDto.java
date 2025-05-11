package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.enams.StateParkingSpace;

public record ParkingSpaceAPDto(
        Long id,
        UserDto owner,
        Integer order,
        Integer hourlyPrice,
        Integer dailyPrice,
        Integer weeklyPrice,
        Integer monthlyPrice,
        StateParkingSpace isAvailable,
        String description,
        ParkingZoneDto parkingZoneDto
) {
}
