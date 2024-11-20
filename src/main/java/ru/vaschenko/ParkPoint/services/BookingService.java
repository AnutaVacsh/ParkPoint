package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.exception.BookingNotFoundException;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.repositories.BookingRepositories;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.util.List;

/*
Создание нового бронирования (запрос от клиента или арендатора).
Получение бронирования по ID.
Получение списка бронирований с возможностью фильтрации по статусу (например, подтвержденные, отмененные и т.д.).
Получение бронирование клиента
Получение бронирование владельца
Получение бронирование на определённое место
Обновление статуса бронирования (например, подтверждение, отмена).
Удаление бронирования.
Пагинация
 */

@Service
@AllArgsConstructor
public class BookingService {
    private final BookingRepositories bookingRepositories;

    //сщздание бронирования
    public Booking createClient(Booking booking) {
        return bookingRepositories.save(booking);
    }

    // Получение бронирования по ID.
    public Booking getBookingById(Long bookingId) {
        return bookingRepositories.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
    }

    // Получение списка бронирований с возможностью фильтрации по статусу.
//    public List<Booking> getBookingsByStatus(StateBooking status) {
//        return bookingRepositories.findByStatus(status);
//    }

    // Получение бронирований клиента.
    public List<Booking> getBookingsByClientId(Long clientId) {
        if (!bookingRepositories.existsByClientId(clientId)) {
            throw new BookingNotFoundException("Bookings not found for client with id: " + clientId);
        }
        return bookingRepositories.findByClientId(clientId);
    }

    // Получение бронирований владельца.
    public List<Booking> getBookingsByOwnerId(Long ownerId) {
        if (!bookingRepositories.existsByParkingSpace_ParkingZone_OwnerId(ownerId)) {
            throw new BookingNotFoundException("Bookings not found for owner with id: " + ownerId);
        }
        return bookingRepositories.findByParkingSpace_ParkingZone_OwnerId(ownerId);
    }

    // Получение бронирований на определённое место.
    public List<Booking> getBookingsByParkingSpaceId(Long parkingSpaceId) {
        if (!bookingRepositories.existsByParkingSpaceId(parkingSpaceId)) {
            throw new BookingNotFoundException("Bookings not found for parking space with id: " + parkingSpaceId);
        }
        return bookingRepositories.findByParkingSpaceId(parkingSpaceId);
    }

    // Обновление статуса бронирования.
    @Transactional
    public Booking updateBookingStatus(Long bookingId, StateBooking status) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        return bookingRepositories.save(booking);
    }

    // Удаление бронирования.
    public void deleteBooking(Long bookingId) {
        if (!bookingRepositories.existsById(bookingId)) {
            throw new BookingNotFoundException("Cannot delete. Booking not found with id: " + bookingId);
        }
        bookingRepositories.deleteById(bookingId);
    }

    // Получение всех бронирований с пагинацией и фильтрацией по статусу.
    public Page<Booking> getBookingsWithPaginationAndStatus(Pageable pageable, StateBooking status) {
        return bookingRepositories.findByStatus(status, pageable);
    }

    // Получение всех бронирований с пагинацией.
    public Page<Booking> getAllBookings(Pageable pageable) {
        return bookingRepositories.findAll(pageable);
    }

}
