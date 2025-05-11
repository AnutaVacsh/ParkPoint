package ru.vaschenko.ParkPoint.dto.request;

public record FilterDTO(
        String field,
        String value,
        String operator
) { }
