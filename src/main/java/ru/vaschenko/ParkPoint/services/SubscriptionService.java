package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.SubscriptionDto;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionCheckRequest;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionCreateRequestDto;
import ru.vaschenko.ParkPoint.enams.StateBooking;
import ru.vaschenko.ParkPoint.mappers.SubscriptionMapper;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.models.Subscription;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.BookingRepository;
import ru.vaschenko.ParkPoint.repositories.SubscriptionRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import java.awt.print.Book;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final BookingRepository bookingRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final UserService userService;
    private final ParkingSpaceService parkingSpaceService;

    public ResponseEntity<List<SubscriptionDto>> getUserSubscriptions(Long userId) {
        log.debug("get user subscription {}", userId);
        return ResponseEntity.ok(subscriptionRepository
                .findByClientId(userId)
                .stream().map(subscriptionMapper::toDto).toList());
    }

    public ResponseEntity<SubscriptionDto> getSubscriptionById(Long id) {
        return ResponseEntity.ok(subscriptionMapper.toDto(getById(id)));
    }

    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
        log.debug("get all subscription");
        return ResponseEntity.ok(subscriptionRepository.findAll().stream().map(subscriptionMapper::toDto).toList());
    }

    public ResponseEntity<SubscriptionDto> createSubscriptions(SubscriptionCreateRequestDto createRequestDto){
        Subscription subscription = subscriptionMapper.toEntity(createRequestDto);
        subscription.setClient(userService.findById(createRequestDto.clientId()));
        subscription.setParkingSpace(parkingSpaceService.getById(createRequestDto.parkingSpaceId()));

        subscription = subscriptionRepository.save(subscription);
        log.debug("Save subscription: {}", subscription);
        return ResponseEntity.ok(subscriptionMapper.toDto(subscription));
    }

    private Subscription getById(Long id){
        log.debug("Looking for subscription with ID: {}", id);
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("subscription not found"));
    }

    public ResponseEntity<List<SubscriptionDto>> getOwnerSubscriptions(Long userId) {
        User owner = userService.findById(userId);

        List<Subscription> subscriptions = subscriptionRepository.findByParkingSpaceOwnerId(userId);
        List<SubscriptionDto> dtos = subscriptions.stream()
                .map(subscriptionMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    public ResponseEntity<Boolean> check(SubscriptionCheckRequest createRequestDto) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);

        // Проверяем подписки
        List<Subscription> existingSubscriptions = subscriptionRepository
                .findByParkingSpaceIdAndCreateTimeAfter(createRequestDto.parkingSpaceId(), cutoff);

        boolean isSubscriptionFree = isSubscriptionSlotFree(
                existingSubscriptions,
                createRequestDto.dayOfWeak(),
                createRequestDto.startTime(),
                createRequestDto.endTime()
        );

        if (!isSubscriptionFree) {
            return ResponseEntity.ok(false);
        }

        // Проверяем бронирования
        boolean isBookingFree = isBookingSlotFree(
                createRequestDto.parkingSpaceId(),
                createRequestDto.dayOfWeak(),
                createRequestDto.startTime(),
                createRequestDto.endTime()
        );

        return ResponseEntity.ok(isBookingFree);
    }

    private boolean isSubscriptionSlotFree(
            List<Subscription> existingSubscriptions,
            List<Integer> newDays,
            LocalTime newStartTime,
            LocalTime newEndTime) {

        for (Subscription sub : existingSubscriptions) {
            boolean daysIntersect = sub.getDayOfWeak().stream()
                    .anyMatch(newDays::contains);

            if (!daysIntersect) {
                continue;
            }

            if (newStartTime.isBefore(sub.getEndTime()) && newEndTime.isAfter(sub.getStartTime())) {
                return false;
            }
        }
        return true;
    }

    private boolean isBookingSlotFree(
            Long parkingSpaceId,
            List<Integer> daysOfWeek,
            LocalTime startTime,
            LocalTime endTime) {

        LocalDateTime now = LocalDateTime.now();

        for (Integer dayOfWeek : daysOfWeek) {
            LocalDateTime date = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.of(dayOfWeek)));

            LocalDateTime bookingStart = date.with(startTime);
            LocalDateTime bookingEnd = date.with(endTime);

            if (bookingEnd.isBefore(bookingStart)) {
                bookingEnd = bookingEnd.plusDays(1);
            }

            List<Booking> activeBookings =
                    bookingRepository.findByParkingSpaceIdAndStatusAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                    parkingSpaceId,
                    StateBooking.CONFIRMED,
                    bookingEnd,
                    bookingStart
            );

            if (!activeBookings.isEmpty()) {
                return false;
            }
        }

        return true;
    }
}
