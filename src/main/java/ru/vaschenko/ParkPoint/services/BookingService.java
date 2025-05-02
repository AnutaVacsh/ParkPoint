package ru.vaschenko.ParkPoint.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.request.BookingRequestDto;
import ru.vaschenko.ParkPoint.mappers.BookingMapper;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.repositories.BookingRepository;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

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
}
