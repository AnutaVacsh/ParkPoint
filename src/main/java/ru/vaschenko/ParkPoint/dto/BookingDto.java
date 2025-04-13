package ru.vaschenko.ParkPoint.dto;

import java.time.LocalDateTime;
import ru.vaschenko.ParkPoint.enams.StateBooking;

public record BookingDto(
        Long id,
        UserDto client,
        ParkingSpaceDto parkingSpace,
        LocalDateTime startTime, 
        LocalDateTime endTime,
        LocalDateTime dateCreated,
        StateBooking status
) {}
