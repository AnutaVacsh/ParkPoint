package ru.vaschenko.ParkPoint.dto;

import java.util.List;

public record ParkingZonePartDto(
    Long id,
    String title,
    String address,
    int parkingSpacesCount,
    double latitude,
    double longitude,
    List<RevParkingZoneDto> rev
) {}
