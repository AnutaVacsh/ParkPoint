package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.BookingApi;
import ru.vaschenko.ParkPoint.dto.BookingDto;
import ru.vaschenko.ParkPoint.dto.request.BookingRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SearchRequestDTO;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionRequestDto;
import ru.vaschenko.ParkPoint.dto.response.SubscriptionResponseDto;
import ru.vaschenko.ParkPoint.enams.StateBooking;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.services.BookingService;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class BookingController implements BookingApi {
    private final BookingService bookingService;

    @Override
    public ResponseEntity<List<BookingDto>> getBookingInfo(Long id) {
        return null;
    }

    @Override
    public ResponseEntity<List<BookingDto>> getUserBooking(Long id) {
        return null;
    }

    @Override
    public ResponseEntity<Booking> createBooking(BookingRequestDto request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @Override
    public ResponseEntity<Booking> changeStateBooking(Long bookingId, StateBooking state) {
        return bookingService.changeStateBooking(bookingId, state);
    }

    @Override
    public ResponseEntity<SubscriptionResponseDto> getSubscriptionInfo(Long idParkingSpace) {
        return null;
    }

    @Override
    public ResponseEntity<String> createSubscription(SubscriptionRequestDto request) {
        return null;
    }

    @Override
    public Page<BookingDto> getBookingsWithPagination(Long userId, SearchRequestDTO searchRequest) {
        return bookingService.getBookingsWithPagination(userId, searchRequest);
    }

}
