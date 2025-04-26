package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;

public record OwnerRegisterRequestDto(
        RegisterRequestDto registerRequestDto,
        ParkingSpaceDto parkingSpaceDto
) {
}
