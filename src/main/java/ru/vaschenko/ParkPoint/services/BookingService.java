package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.BookingDTO;
import ru.vaschenko.ParkPoint.dto.mapper.BookingMapper;
import ru.vaschenko.ParkPoint.exception.BookingNotFoundException;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.repositories.BookingRepositories;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.util.List;
import java.util.stream.Collectors;

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
    private final BookingMapper bookingMapper; // Добавляем маппер

    // Создание бронирования
    public BookingDTO createClient(BookingDTO booking) {
        Booking savedBooking = bookingRepositories.save(bookingMapper.toEntity(booking));
        return bookingMapper.toDTO(savedBooking); // Преобразуем сущность в DTO
    }

    // Получение бронирования по ID.
    public BookingDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepositories.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        return bookingMapper.toDTO(booking); // Преобразуем сущность в DTO
    }

    // Получение списка бронирований с возможностью фильтрации по статусу.
//    public List<BookingDTO> getBookingsByStatus(StateBooking status) {
//        List<Booking> bookings = bookingRepositories.findByStatus(status);
//        return bookings.stream()
//                .map(bookingMapper::toDTO)
//                .collect(Collectors.toList());
//    }

    // Получение бронирований клиента.
    public List<BookingDTO> getBookingsByClientId(Long clientId) {
        if (!bookingRepositories.existsByClientId(clientId)) {
            throw new BookingNotFoundException("Bookings not found for client with id: " + clientId);
        }
        List<Booking> bookings = bookingRepositories.findByClientId(clientId);
        return bookings.stream()
                .map(bookingMapper::toDTO) // Преобразуем каждое бронирование в DTO
                .collect(Collectors.toList());
    }

    // Получение бронирований владельца.
    public List<BookingDTO> getBookingsByOwnerId(Long ownerId) {
        if (!bookingRepositories.existsByParkingSpace_ParkingZone_OwnerId(ownerId)) {
            throw new BookingNotFoundException("Bookings not found for owner with id: " + ownerId);
        }
        List<Booking> bookings = bookingRepositories.findByParkingSpace_ParkingZone_OwnerId(ownerId);
        return bookings.stream()
                .map(bookingMapper::toDTO) // Преобразуем каждое бронирование в DTO
                .collect(Collectors.toList());
    }

    // Получение бронирований на определённое место.
    public List<BookingDTO> getBookingsByParkingSpaceId(Long parkingSpaceId) {
        if (!bookingRepositories.existsByParkingSpaceId(parkingSpaceId)) {
            throw new BookingNotFoundException("Bookings not found for parking space with id: " + parkingSpaceId);
        }
        List<Booking> bookings = bookingRepositories.findByParkingSpaceId(parkingSpaceId);
        return bookings.stream()
                .map(bookingMapper::toDTO) // Преобразуем каждое бронирование в DTO
                .collect(Collectors.toList());
    }

    // Обновление статуса бронирования.
    @Transactional
    public BookingDTO updateBookingStatus(Long bookingId, StateBooking status) {
        Booking booking = bookingRepositories.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));;// Получаем бронирование
        booking.setStatus(status);
        Booking updatedBooking = bookingRepositories.save(booking);
        return bookingMapper.toDTO(updatedBooking); // Преобразуем обновленную сущность в DTO
    }

    // Удаление бронирования.
    public void deleteBooking(Long bookingId) {
        if (!bookingRepositories.existsById(bookingId)) {
            throw new BookingNotFoundException("Cannot delete. Booking not found with id: " + bookingId);
        }
        bookingRepositories.deleteById(bookingId);
    }

    // Получение всех бронирований с пагинацией и фильтрацией по статусу.
//    public Page<BookingDTO> getBookingsWithPaginationAndStatus(Pageable pageable, StateBooking status) {
//        Page<Booking> bookings = bookingRepositories.findByStatus(status, pageable);
//        return bookings.map(bookingMapper::toDTO); // Преобразуем каждую сущность в DTO
//    }
//
//    // Получение всех бронирований с пагинацией.
//    public Page<BookingDTO> getAllBookings(Pageable pageable) {
//        Page<Booking> bookings = bookingRepositories.findAll(pageable);
//        return bookings.map(bookingMapper::toDTO); // Преобразуем каждую сущность в DTO
//    }

}
