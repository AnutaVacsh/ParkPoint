package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.mappers.ParkingZoneMapper;
import ru.vaschenko.ParkPoint.models.ParkingZone;
import ru.vaschenko.ParkPoint.repositories.ParkingZoneRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParkingZoneService {
    private final ParkingZoneRepository parkingZoneRepository;
    private final ParkingZoneMapper parkingZoneMapper;

    public ResponseEntity<List<ParkingZoneResponseDto>> getAllParkingZones() {
        return ResponseEntity.ok(parkingZoneRepository.findAll().stream().map(parkingZoneMapper::toResponseDto).toList());
    }

    public ResponseEntity<ParkingZonePartDto> getPartialZoneInfo(Long id) {
        ParkingZone pz = parkingZoneRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Parking zone with id " + id + " not found"));
        return ResponseEntity.ok(parkingZoneMapper.toPartDto(pz));
    }

    public ResponseEntity<ParkingZoneDto> getFullZoneInfo(Long id) {
        ParkingZone pz = parkingZoneRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Parking zone with id " + id + " not found"));
        return ResponseEntity.ok(parkingZoneMapper.toDto(pz));
    }
}
