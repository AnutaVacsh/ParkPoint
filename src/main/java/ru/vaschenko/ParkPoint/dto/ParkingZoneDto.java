package ru.vaschenko.ParkPoint.dto;

import java.util.List;

import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import ru.vaschenko.ParkPoint.models.Photo;

public record ParkingZoneDto(
    Long id,
    Long zoneManager,
    String title,
    String address,
    String description,
    String map,
    StateParkingZone state,
    int parkingSpacesCount,
    double latitude,
    double longitude,
    List<Photo> photos) {
}
