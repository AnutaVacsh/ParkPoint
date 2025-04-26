package ru.vaschenko.ParkPoint.dto;

import ru.vaschenko.ParkPoint.enams.Role;

public record UserDto(
        Long id,
        String email,
        Role role
) {}
