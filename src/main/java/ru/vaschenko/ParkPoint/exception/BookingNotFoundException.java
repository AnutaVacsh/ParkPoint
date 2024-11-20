package ru.vaschenko.ParkPoint.exception;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException() {
        super("Booking not found");
    }

    public BookingNotFoundException(String message) {
        super(message);
    }

    // сообщение и причина
    public BookingNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
