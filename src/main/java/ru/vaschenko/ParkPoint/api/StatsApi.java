package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.request.BookingStatsDto;
import ru.vaschenko.ParkPoint.dto.request.UserStatsDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.STATS)
public interface StatsApi {

    @GetMapping(ApiPath.ST_BOOKING)
    public ResponseEntity<List<BookingStatsDto>> getBookingStats();

    @GetMapping(ApiPath.ST_USER)
    public ResponseEntity<UserStatsDto> getUserStats();
}
