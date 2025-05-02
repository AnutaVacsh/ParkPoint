package ru.vaschenko.ParkPoint.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.mappers.ParkingSpaceMapper;
import ru.vaschenko.ParkPoint.models.ParkingSpace;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParkingSpaceService {
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final ParkingSpaceMapper parkingSpaceMapper;

    public ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(Long parkingZoneId) {
        List<ParkingSpace> ps = parkingSpaceRepository.findByParkingZoneId(parkingZoneId);
        return ResponseEntity.ok(ps.stream().map(parkingSpaceMapper::parkingSpaceToParkingSpaceDto).toList());
    }
}
