package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.request.BookingRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionRequestDto;
import ru.vaschenko.ParkPoint.dto.response.BookingResponseDto;
import ru.vaschenko.ParkPoint.dto.response.SubscriptionResponseDto;
import ru.vaschenko.ParkPoint.dto.response.UserCardResponseDto;
import ru.vaschenko.ParkPoint.enams.StateBooking;
import ru.vaschenko.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.BOOKING)
public interface BookingApi {
    @GetMapping(ApiPath.BOOKING_INFO)
    ResponseEntity<BookingResponseDto> getBookingInfo(@PathVariable Long id);

    @PostMapping(ApiPath.BOOKING_CREATE)
    ResponseEntity<String> createBooking(@RequestBody BookingRequestDto request);

    @PutMapping(ApiPath.CHANGE_STATE_BOOKING)
    ResponseEntity<String> changeStateBooking(@PathVariable Long bookingId, @RequestBody StateBooking state);

//    Subscription
    @GetMapping(ApiPath.SUBSCRIPTION_INFO)
    ResponseEntity<SubscriptionResponseDto> getSubscriptionInfo(@PathVariable Long idParkingSpace);

    @PostMapping(ApiPath.SUBSCRIPTION_CREATE)
    ResponseEntity<String> createSubscription(@RequestBody SubscriptionRequestDto request);
}
