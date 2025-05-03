package ru.vaschenko.ParkPoint.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.BookingDto;
import ru.vaschenko.ParkPoint.dto.request.BookingRequestDto;
import ru.vaschenko.ParkPoint.dto.response.TimeSlotDto;
import ru.vaschenko.ParkPoint.mappers.BookingMapper;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.repositories.BookingRepository;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final BookingMapper bookingMapper;

    public Booking createBooking(BookingRequestDto request) {
        Booking booking = bookingMapper.toEntity(request, userRepository, parkingSpaceRepository);
        return bookingRepository.save(booking);
    }

    public List<TimeSlotDto> getTimeSlotForParkingSpace(Long parkingSpaceId) {
        log.debug("Временный слоты для {}", parkingSpaceId);
        List<Booking> bookings = bookingRepository.findByParkingSpaceId(parkingSpaceId);

        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private TimeSlotDto convertToDto(Booking booking) {
        return new TimeSlotDto(booking.getStartTime(), booking.getEndTime());
    }
}
