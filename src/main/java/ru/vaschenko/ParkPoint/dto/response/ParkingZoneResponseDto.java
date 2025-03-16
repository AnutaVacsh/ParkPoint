package ru.vaschenko.ParkPoint.dto.response;

public record ParkingZoneResponseDto(
        Long id,
        Double latitude,
        Double longitude,
        int parkingSpacesCount
) {}
