package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;

import java.time.LocalDateTime;
import java.util.List;

public record BookingResponseDto(
        List<ParkingSpaceDto> parkingSpaces
) {}
