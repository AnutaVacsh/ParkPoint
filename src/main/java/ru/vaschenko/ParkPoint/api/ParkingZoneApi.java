package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.PARKING_ZONES)
public interface ParkingZoneApi {
    @GetMapping(ApiPath.PARKING_ZONES_LIST)
    ResponseEntity<List<ParkingZoneResponseDto>> getAllParkingZones(); //TODO только активные

    @GetMapping(ApiPath.PARKING_ZONE_PARTIAL)
    ResponseEntity<ParkingZonePartDto> getPartialZoneInfo(@PathVariable Long id);

    @GetMapping(ApiPath.PARKING_ZONE_FULL)
    ResponseEntity<ParkingZoneDto> getFullZoneInfo(@PathVariable Long id);
}
