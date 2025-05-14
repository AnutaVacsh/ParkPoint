package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.dto.PhotoDto;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import ru.vaschenko.ParkPoint.models.Photo;
import ru.vaschenko.ParkPoint.models.User;

import java.util.List;

public record ParkingZoneCreateDto(
        UserDto zoneManager,
        String title,
        String address,
        String description,
        String map,
        StateParkingZone state,
        double latitude,
        double longitude,
        List<PhotoDto> photos
) {
}
