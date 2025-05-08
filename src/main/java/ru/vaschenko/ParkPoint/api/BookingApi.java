package ru.vaschenko.ParkPoint.api;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.BookingDto;
import ru.vaschenko.ParkPoint.dto.request.BookingRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SearchRequestDTO;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionRequestDto;
import ru.vaschenko.ParkPoint.dto.response.SubscriptionResponseDto;
import ru.vaschenko.ParkPoint.enams.StateBooking;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.BOOKING)
public interface BookingApi {
    @GetMapping(ApiPath.BOOKING_INFO)
    ResponseEntity<List<BookingDto>> getBookingInfo(@PathVariable Long id);

    @GetMapping(ApiPath.USER_BOOKING)
    ResponseEntity<List<BookingDto>> getUserBooking(@PathVariable Long id);

    @PostMapping(ApiPath.BOOKING_CREATE)
    ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDto request);

    @PutMapping(ApiPath.CHANGE_STATE_BOOKING)
    ResponseEntity<Booking> changeStateBooking(@PathVariable Long bookingId, @RequestBody StateBooking state);

    @PostMapping(ApiPath.BOOKING_PAG)
    public Page<BookingDto> getBookingsWithPagination(@PathVariable Long userId,
                                                      @RequestBody SearchRequestDTO searchRequest);

    @PostMapping(ApiPath.BOOKING_PAG_OWNER)
    public Page<BookingDto> getBookingsOwnerWithPagination(@PathVariable Long userId,
                                                      @RequestBody SearchRequestDTO searchRequest);
}
