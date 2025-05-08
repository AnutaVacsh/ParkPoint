package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;

public record OwnerRegisterRequestDto(
        RegisterRequestDto registerRequestDto,
        ParkingSpaceRequestDto parkingSpaceRequestDto
) {
}
