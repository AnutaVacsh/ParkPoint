package ru.vaschenko.ParkPoint.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceBookingDto;
import ru.vaschenko.ParkPoint.mappers.ParkingSpaceMapper;
import ru.vaschenko.ParkPoint.models.ParkingSpace;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParkingSpaceService {
    private final BookingService bookingService;
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final ParkingSpaceMapper parkingSpaceMapper;

    public ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(Long parkingZoneId) {
        List<ParkingSpace> ps = parkingSpaceRepository.findByParkingZoneId(parkingZoneId);
        log.debug("Все места зоны {}", parkingZoneId);
        return ResponseEntity.ok(ps.stream().map(parkingSpaceMapper::parkingSpaceToParkingSpaceDto).toList());
    }

    public ResponseEntity<List<ParkingSpaceBookingDto>> getParkingSpaceToBookingIntoZone(Long parkingZoneId) {
        List<ParkingSpace> ps = parkingSpaceRepository.findByParkingZoneId(parkingZoneId);
        log.debug("Все места зоны {}", parkingZoneId);

        List<ParkingSpaceBookingDto> psbd = ps.stream()
                .map(p -> new ParkingSpaceBookingDto(
                        parkingSpaceMapper.parkingSpaceToParkingSpaceDto(p),
                        bookingService.getTimeSlotForParkingSpace(p.getId())))
                .toList();

        return ResponseEntity.ok(psbd);
    }
}
