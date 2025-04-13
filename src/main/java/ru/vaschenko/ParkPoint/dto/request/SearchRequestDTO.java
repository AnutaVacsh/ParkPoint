package ru.vaschenko.ParkPoint.dto.request;

public record SearchRequestDTO(
        int page,
        int size,
        String sortDirection,
        String sortBy,
        String filter
) {}
