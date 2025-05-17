package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.BookingDto;
import ru.vaschenko.ParkPoint.dto.request.BookingRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SearchRequestDTO;
import ru.vaschenko.ParkPoint.dto.response.TimeSlotDto;
import ru.vaschenko.ParkPoint.enams.StateBooking;
import ru.vaschenko.ParkPoint.mappers.BookingMapper;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.models.Subscription;
import ru.vaschenko.ParkPoint.repositories.BookingRepository;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;
import ru.vaschenko.ParkPoint.repositories.SubscriptionRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;

import java.awt.print.Book;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final BookingMapper bookingMapper;

    public ResponseEntity<BookingDto> getBookingInfo(Long id) {
        return ResponseEntity.ok(bookingMapper.toDto(getBookingById(id)));
    }

    public Booking createBooking(BookingRequestDto request) {
        log.debug("Запрос на сохранение брони {}", request);
        Booking booking = bookingMapper.toEntity(request, userRepository, parkingSpaceRepository);
        log.debug("Сохранение брони {}", booking);
        return bookingRepository.save(booking);
    }

    public List<TimeSlotDto> getTimeSlotForParkingSpace(Long parkingSpaceId) {
        log.debug("Временные слоты для {}", parkingSpaceId);
        List<Booking> bookings = bookingRepository.findByParkingSpaceId(parkingSpaceId);
        List<Subscription> subscriptions = subscriptionRepository.findByParkingSpaceId(parkingSpaceId);

        List<TimeSlotDto> bookingSlots = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        List<TimeSlotDto> subscriptionSlots = subscriptions.stream()
                .flatMap(this::expandSubscriptionToTimeSlots)
                .collect(Collectors.toList());

        bookingSlots.addAll(subscriptionSlots);
        return bookingSlots;
    }

    private Stream<TimeSlotDto> expandSubscriptionToTimeSlots(Subscription sub) {
        if (sub.getCreateTime() == null) {
            return Stream.empty();
        }

        LocalDateTime start = sub.getCreateTime();
        LocalDateTime end = start.plusMonths(1);
        List<Integer> daysOfWeek = sub.getDayOfWeak();

        List<TimeSlotDto> slots = new ArrayList<>();
        LocalDateTime current = start.toLocalDate().atStartOfDay();

        while (!current.isAfter(end)) {
            int dayOfWeekJava = current.getDayOfWeek().getValue(); // 1 - понедельник, 7 - воскресенье

            if (daysOfWeek.contains(dayOfWeekJava)) {
                LocalDateTime slotStart = current.withHour(sub.getStartTime().getHour())
                        .withMinute(sub.getStartTime().getMinute());

                LocalDateTime slotEnd = current.withHour(sub.getEndTime().getHour())
                        .withMinute(sub.getEndTime().getMinute());

                slots.add(new TimeSlotDto(slotStart, slotEnd));
            }

            current = current.plusDays(1);
        }

        return slots.stream();
    }

    public ResponseEntity<Booking> changeStateBooking(Long bookingId, StateBooking state) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(state);
        bookingRepository.save(booking);
        log.info("Booking {} status changed from {} to {}", bookingId, booking.getStatus(), state);
        return ResponseEntity.ok(booking);
    }

    public Page<BookingDto> getBookingsWithPagination(Long userId, SearchRequestDTO searchRequest) {
        Specification<Booking> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("client").get("id"), userId));

            if (searchRequest.filter() != null && !searchRequest.filter().isEmpty()) {
                predicates.add(cb.equal(root.get("status"), StateBooking.valueOf(searchRequest.filter())));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.by(
                searchRequest.sortDirection().equalsIgnoreCase("ASC") ?
                        Sort.Direction.ASC : Sort.Direction.DESC,
                searchRequest.sortBy()
        );

        Page<Booking> bookings = bookingRepository.findAll(
                spec,
                PageRequest.of(searchRequest.page() - 1, searchRequest.size(), sort)
        );

        return bookings.map(bookingMapper::toDto);
    }

    private TimeSlotDto convertToDto(Booking booking) {
        return new TimeSlotDto(booking.getStartTime(), booking.getEndTime());
    }

    private Booking getBookingById(Long id){
        return bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
    }

    public Page<BookingDto> getOwnerBookingsWithPagination(Long ownerId, SearchRequestDTO searchRequest) {
        log.info("serch OwnerBookingsWithPagination owner id: {}", ownerId);
        Specification<Booking> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("parkingSpace").get("owner").get("id"), ownerId));

            if (searchRequest.filter() != null && !searchRequest.filter().isEmpty()) {
                predicates.add(cb.equal(root.get("status"), StateBooking.valueOf(searchRequest.filter())));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.by(
                searchRequest.sortDirection().equalsIgnoreCase("ASC") ?
                        Sort.Direction.ASC : Sort.Direction.DESC,
                searchRequest.sortBy()
        );

        Page<Booking> bookings = bookingRepository.findAll(
                spec,
                PageRequest.of(searchRequest.page() - 1, searchRequest.size(), sort)
        );

        return bookings.map(bookingMapper::toDto);
    }
}