package ru.vaschenko.ParkPoint.dto;

import java.time.LocalDateTime;
import ru.vaschenko.ParkPoint.enams.StateComplaint;
import ru.vaschenko.ParkPoint.models.User;

public record ComplaintDto(
    Long id,
    UserDto complainant,
    UserDto accused,
    String text,
    StateComplaint status,
    LocalDateTime createdAt
) {}
