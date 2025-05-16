package ru.vaschenko.ParkPoint.dto;

public record ChatDto(
        Long id,
        UserDto owner,
        UserDto client
) {
}
