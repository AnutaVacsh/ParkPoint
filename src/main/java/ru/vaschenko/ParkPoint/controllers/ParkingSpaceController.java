package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.ParkingSpaceApi;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.dto.request.ParkingSpaceRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ParkingSpaceUpdateRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SearchRequestDTO;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceBookingDto;
import ru.vaschenko.ParkPoint.enams.StateParkingSpace;
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
    public ResponseEntity<Page<ParkingSpaceAPDto>> getAllParkingSpaceWithPag(APSearchRequestDto requestDTO) {
        int page = requestDTO.page();
        int size = requestDTO.size();
        String sortDirection = requestDTO.sortDirection();
        String sortBy = requestDTO.sortBy();
        List<FilterDTO> filters = requestDTO.filters();

        Page<ParkingSpaceAPDto> result = parkingSpaceService.searchParkingSpaces(page, size, sortBy, sortDirection, filters);

        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<ParkingSpaceDto> getParkingSpaceById(Long id) {
        return parkingSpaceService.getParkingSpaceById(id);
    }

    @Override
    public ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceByUserId(Long userId) {
        return parkingSpaceService.getParkingSpaceByUserId(userId);
    }

    @Override
    public ResponseEntity<ParkingSpaceDto> updateParkingSpace(ParkingSpaceUpdateRequestDto parkingSpaceDto) {
        return parkingSpaceService.updateParkingSpace(parkingSpaceDto);
    }

    @Override
    public ResponseEntity<ParkingSpaceDto> updateStateParkingSpace(Long id, StateParkingSpace newState) {
        return parkingSpaceService.updateState(id, newState);
    }

    @Override
    public ResponseEntity<ParkingSpaceDto> createParkingSpace(ParkingSpaceRequestDto parkingSpaceDto) {
        return parkingSpaceService.createParkingSpace(parkingSpaceDto);
    }
}