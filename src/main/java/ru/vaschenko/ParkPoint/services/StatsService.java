package ru.vaschenko.ParkPoint.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.request.BookingStatsDto;
import ru.vaschenko.ParkPoint.dto.request.UserStatsDto;
import ru.vaschenko.ParkPoint.enams.Role;
import ru.vaschenko.ParkPoint.enams.StateBooking;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.repositories.BookingRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ResponseEntity<List<BookingStatsDto>> getBookingStats() {
        LocalDateTime fromDate = LocalDate.now().minusDays(13).atStartOfDay();
        List<Booking> recentBookings = bookingRepository.findByDateCreatedAfter(fromDate);

        Map<LocalDate, List<Booking>> grouped = recentBookings.stream()
                .collect(Collectors.groupingBy(b -> b.getDateCreated().toLocalDate()));

        List<BookingStatsDto> stats = new ArrayList<>();

        for (int i = 13; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            List<Booking> dailyBookings = grouped.getOrDefault(date, Collections.emptyList());

            int sent = dailyBookings.size();
            int confirmed = (int) dailyBookings.stream()
                    .filter(b -> b.getStatus() == StateBooking.CONFIRMED)
                    .count();

            stats.add(new BookingStatsDto(date.atStartOfDay(), sent, confirmed));
        }

        return ResponseEntity.ok(stats);
    }

    public ResponseEntity<UserStatsDto> getUserStats() {
        int users = userRepository.countByRole(Role.CLIENT);
        int owners = userRepository.countByRole(Role.OWNER);

        return ResponseEntity.ok(new UserStatsDto(users, owners));
    }
}
