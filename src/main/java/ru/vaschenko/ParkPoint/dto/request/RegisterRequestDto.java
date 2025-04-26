package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.dto.PasswordDto;
import ru.vaschenko.ParkPoint.enams.Role;

public record RegisterRequestDto(
        String email,
        String password,
        Role role
) {}
