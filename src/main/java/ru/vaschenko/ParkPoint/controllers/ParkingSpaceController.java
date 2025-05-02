package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import ru.vaschenko.ParkPoint.api.ParkingSpaceApi;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.services.ParkingSpaceService;

import java.util.List;

@Controller
@CrossOrigin
@RequiredArgsConstructor
public class ParkingSpaceController implements ParkingSpaceApi {
    private final ParkingSpaceService parkingSpaceService;

    @Override
    public ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(Long parkingZoneId) {
        return parkingSpaceService.getParkingSpaceIntoZone(parkingZoneId);
    }
}
