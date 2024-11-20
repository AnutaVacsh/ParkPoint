package ru.vaschenko.ParkPoint.exception;

public class ParkingZoneNotFoundException extends RuntimeException {
    public ParkingZoneNotFoundException(String message) {
        super(message);
    }
}
