package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.enams.StateBooking;

public record MyBookingRequestDto(
        StateBooking status, //фильтрация по статусу
        Long parkingZoneId,
        Long ownerId,
        Long clientId,
        int page,
        int size,
        String sortBy, // сортировка по полю
        String sortDirection
) {
    public MyBookingRequestDto{
        if (page < 0) page = 0;
        if (size <= 0) size = 10;
        if (sortBy == null || sortBy.isBlank()) sortBy = "startTime";
        if (sortDirection == null || sortDirection.isBlank()) sortDirection = "DESC";
    }
}
