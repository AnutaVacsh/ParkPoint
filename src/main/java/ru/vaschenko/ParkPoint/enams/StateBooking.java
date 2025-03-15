package ru.vaschenko.ParkPoint.enams;

import lombok.Getter;

@Getter
public enum StateBooking {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    EXPIRED,
    REJECTED
}

