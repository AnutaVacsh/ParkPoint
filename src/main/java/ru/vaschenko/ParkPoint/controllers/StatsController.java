package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.StatsApi;
import ru.vaschenko.ParkPoint.dto.request.BookingStatsDto;
import ru.vaschenko.ParkPoint.dto.request.UserStatsDto;
import ru.vaschenko.ParkPoint.services.StatsService;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
public class StatsController implements StatsApi {
    private final StatsService service;

    @Override
    public ResponseEntity<List<BookingStatsDto>> getBookingStats() {
        return service.getBookingStats();
    }

    @Override
    public ResponseEntity<UserStatsDto> getUserStats() {
        return service.getUserStats();
    }
}
