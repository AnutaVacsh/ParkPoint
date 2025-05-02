package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import ru.vaschenko.ParkPoint.api.ParkingZoneApi;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.services.ParkingZoneService;

import java.util.List;

@Controller
@CrossOrigin
@RequiredArgsConstructor
public class ParkingZoneController implements ParkingZoneApi {
    private final ParkingZoneService parkingZoneService;

    @Override
    public ResponseEntity<List<ParkingZoneResponseDto>> getAllParkingZones() {
        return parkingZoneService.getAllParkingZones();
    }

    @Override
    public ResponseEntity<ParkingZonePartDto> getPartialZoneInfo(Long id) {
        return parkingZoneService.getPartialZoneInfo(id);
    }

    @Override
    public ResponseEntity<ParkingZoneDto> getFullZoneInfo(Long id) {
        return parkingZoneService.getFullZoneInfo(id);
    }
}
