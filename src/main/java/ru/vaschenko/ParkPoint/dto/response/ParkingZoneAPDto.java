package ru.vaschenko.ParkPoint.dto.response;

import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import ru.vaschenko.ParkPoint.models.Photo;

import java.util.List;

public record ParkingZoneAPDto(
        Long id,
        UserDto zoneManager,
        String title,
        String address,
        String description,
        String map,
        StateParkingZone state,
        int parkingSpacesCount,
        double latitude,
        double longitude,
        List<Photo> photos
) {
}
