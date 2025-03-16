package ru.vaschenko.ParkPoint.dto;

import java.util.List;
import ru.vaschenko.ParkPoint.models.Photo;

public record ParkingZoneDto(
    Long id,
    String title,
    String address,
    String description,
    String map,
    int parkingSpacesCount,
    List<Photo> photos) {}
