package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.ParkingZoneApi;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.dto.request.NearestZonesRequest;
import ru.vaschenko.ParkPoint.dto.request.ParkingZoneCreateDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import ru.vaschenko.ParkPoint.models.ParkingZone;
import ru.vaschenko.ParkPoint.services.ParkingZoneService;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class ParkingZoneController implements ParkingZoneApi {
    private final ParkingZoneService parkingZoneService;

    @Override
    public ResponseEntity<List<ParkingZoneResponseDto>> getAllParkingZones() {
        return parkingZoneService.getActiveParkingZones();
    }

    @Override
    public ResponseEntity<ParkingZonePartDto> getPartialZoneInfo(Long id) {
        return parkingZoneService.getPartialZoneInfo(id);
    }

    @Override
    public ResponseEntity<ParkingZoneDto> getFullZoneInfo(Long id) {
        return parkingZoneService.getFullZoneInfo(id);
    }

    @Override
    public ResponseEntity<Void> updateStatus(Long id, StateParkingZone newStatus) {
        parkingZoneService.updateStatus(id, newStatus);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Page<ParkingZoneAPDto>> getAllParkingZoneWithPag(APSearchRequestDto requestDTO) {
        int page = requestDTO.page();
        int size = requestDTO.size();
        String sortBy = requestDTO.sortBy();
        String sortDirection = requestDTO.sortDirection();
        List<FilterDTO> filters = requestDTO.filters();

        Page<ParkingZoneAPDto> pageResult = parkingZoneService.searchParkingZones(page, size, sortBy, sortDirection, filters);

        return ResponseEntity.ok(pageResult);
    }

    @Override
    public ResponseEntity<ParkingZone> createParkingZoneWithPag(ParkingZoneCreateDto requestDTO) {
        return parkingZoneService.createParkingZone(requestDTO);
    }

    @Override
    public List<ParkingZoneDto> findNearestZones(NearestZonesRequest request) {
        return parkingZoneService.findNearestZones(request.latitude(), request.longitude(), 3);
    }

}
