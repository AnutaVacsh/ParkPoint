package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * создание бронирования
 */
public record BookingRequestDto(
        Long clientId,
        Long parkingSpaceId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer price
) {}
