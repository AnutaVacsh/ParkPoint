package ru.vaschenko.ParkPoint.dto;

import java.time.LocalDateTime;
import ru.vaschenko.ParkPoint.enams.StateComplaint;
import ru.vaschenko.ParkPoint.models.User;

public record ComplaintDto(
    Long id,
    User complainant,
    User accused,
    String text,
    StateComplaint status,
    LocalDateTime createdAt
) {}
