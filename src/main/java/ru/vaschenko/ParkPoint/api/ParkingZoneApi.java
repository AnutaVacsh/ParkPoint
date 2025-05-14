package ru.vaschenko.ParkPoint.api;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ParkingZoneCreateDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import ru.vaschenko.ParkPoint.models.ParkingZone;
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

    @PutMapping(ApiPath.PARKING_ZONE_UPDATE_STATE)
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam StateParkingZone newStatus);

    @PostMapping(ApiPath.PARKING_ZONE_PAG)
    ResponseEntity<Page<ParkingZoneAPDto>> getAllParkingZoneWithPag(@RequestBody APSearchRequestDto requestDTO);

    @PostMapping(ApiPath.PARKING_ZONE_CREATE)
    ResponseEntity<ParkingZone> createParkingZoneWithPag(@RequestBody ParkingZoneCreateDto requestDTO);
}
