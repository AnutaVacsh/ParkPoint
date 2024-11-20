package ru.vaschenko.ParkPoint.type;

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

