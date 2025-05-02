package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.PARKING_SPACES)
public interface ParkingSpaceApi {
    @GetMapping(ApiPath.PARKING_SPACES_ZONE_LIST)
    ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(@RequestParam Long parkingZoneId);
}
