package ru.vaschenko.ParkPoint.dto;

import java.util.List;

public record ParkingSpaceDto(
        Long id,
        Long idOwner,
        Integer order,
        Integer price,
        Boolean isAvailable,
        ParkingZoneDto parkingZoneDto,
        List<BookingDto> bookings
) {}
