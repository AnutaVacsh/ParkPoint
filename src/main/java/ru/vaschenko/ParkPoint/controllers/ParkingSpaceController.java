package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.ParkingSpaceApi;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceBookingDto;
import ru.vaschenko.ParkPoint.services.ParkingSpaceService;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class ParkingSpaceController implements ParkingSpaceApi {
    private final ParkingSpaceService parkingSpaceService;

    @Override
    public ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(Long parkingZoneId) {
        return parkingSpaceService.getParkingSpaceIntoZone(parkingZoneId);
    }

    @Override
    public ResponseEntity<List<ParkingSpaceBookingDto>> getParkingSpaceIntoZoneByBooking(Long parkingZoneId) {
        return parkingSpaceService.getParkingSpaceToBookingIntoZone(parkingZoneId);
    }

    @Override
    public ResponseEntity<ParkingSpaceDto> getParkingSpaceById(Long id) {
        return parkingSpaceService.getParkingSpaceById(id);
    }
}
