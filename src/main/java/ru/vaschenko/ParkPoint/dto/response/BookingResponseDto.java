package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;

import java.time.LocalDateTime;

/**
 * Запрос на создание бронирования
 */
public record BookingResponseDto(
        Long parkingSpaces,
        Long client,
        LocalDateTime startTime,
        LocalDateTime endTime
) {
}
