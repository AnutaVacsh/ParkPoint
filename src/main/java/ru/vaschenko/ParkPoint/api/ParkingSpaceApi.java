package ru.vaschenko.ParkPoint.api;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ParkingSpaceRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ParkingSpaceUpdateRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SearchRequestDTO;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceBookingDto;
import ru.vaschenko.ParkPoint.enams.StateParkingSpace;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.PARKING_SPACES)
public interface ParkingSpaceApi {
//    @GetMapping(ApiPath.)
    ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(@PathVariable Long parkingZoneId);

    @GetMapping(ApiPath.PARKING_SPACES_ZONE_LIST)
    ResponseEntity<List<ParkingSpaceBookingDto>> getParkingSpaceIntoZoneByBooking(@PathVariable Long parkingZoneId);

    @PostMapping(ApiPath.PARKING_SPACES_PAG)
    ResponseEntity<Page<ParkingSpaceAPDto>> getAllParkingSpaceWithPag(@RequestBody APSearchRequestDto requestDTO);

    @GetMapping(ApiPath.PARKING_SPACES_ID)
    ResponseEntity<ParkingSpaceDto> getParkingSpaceById(@PathVariable Long id);

    @GetMapping(ApiPath.PARKING_SPACES_USER)
    ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceByUserId(@PathVariable Long userId);

    @PutMapping(ApiPath.PARKING_SPACES_UPDATE)
    ResponseEntity<ParkingSpaceDto> updateParkingSpace(@RequestBody ParkingSpaceUpdateRequestDto parkingSpaceDto);

    @PutMapping(ApiPath.PARKING_SPACE_UPDATE_STATE)
    ResponseEntity<ParkingSpaceDto> updateStateParkingSpace( @RequestParam Long id, @RequestParam StateParkingSpace newState);

    @PostMapping(ApiPath.PARKING_SPACES_CREATE)
    ResponseEntity<ParkingSpaceDto> createParkingSpace(@RequestBody ParkingSpaceRequestDto parkingSpaceDto);

    @DeleteMapping(ApiPath.PARKING_SPACES_DELETE)
    ResponseEntity<Void> deleteParkingSpace(@PathVariable Long id);
}
