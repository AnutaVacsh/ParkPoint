package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.enams.StateBooking;

import java.time.LocalDateTime;

public record MyBookingResponseDto(
        LocalDateTime startTime,
        LocalDateTime endTime,
        ParkingSpaceDto parkingSpaceDto,
        StateBooking status
) {}
