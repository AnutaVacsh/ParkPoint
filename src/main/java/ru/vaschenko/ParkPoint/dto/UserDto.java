package ru.vaschenko.ParkPoint.dto;

import ru.vaschenko.ParkPoint.enams.Role;

public record UserDto(
        String email,
        Role role
) {}
