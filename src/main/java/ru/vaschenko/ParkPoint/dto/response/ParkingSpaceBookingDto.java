package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;

import java.util.List;

//дто для странички бронирования
public record ParkingSpaceBookingDto(
    ParkingSpaceDto parkingSpaceDto,
    List<TimeSlotDto> timeSlots
) {
}
