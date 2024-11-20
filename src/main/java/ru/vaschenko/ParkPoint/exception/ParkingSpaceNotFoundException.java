package ru.vaschenko.ParkPoint.exception;

public class ParkingSpaceNotFoundException extends RuntimeException {
    public ParkingSpaceNotFoundException(String message) {
        super(message);
    }
}
