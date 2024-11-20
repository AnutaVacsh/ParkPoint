package ru.vaschenko.ParkPoint.exception;

public class RevParkZoneNotFoundException extends RuntimeException {
    public RevParkZoneNotFoundException(String message) {
        super(message);
    }
}
