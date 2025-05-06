package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceBookingDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.PARKING_SPACES)
public interface ParkingSpaceApi {
    ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(@PathVariable Long parkingZoneId);

    @GetMapping(ApiPath.PARKING_SPACES_ZONE_LIST)
    ResponseEntity<List<ParkingSpaceBookingDto>> getParkingSpaceIntoZoneByBooking(@PathVariable Long parkingZoneId);

    @GetMapping(ApiPath.PARKING_SPACES_ID)
    ResponseEntity<ParkingSpaceDto> getParkingSpaceById(@PathVariable Long id);
}
