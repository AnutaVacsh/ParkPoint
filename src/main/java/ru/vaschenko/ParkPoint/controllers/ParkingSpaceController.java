package ru.vaschenko.ParkPoint.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDTO;
import ru.vaschenko.ParkPoint.model.ParkingSpace;
import ru.vaschenko.ParkPoint.services.ParkingSpaceServices;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/api/space")
@Tag(name = "Space API", description = "API для работы с парковочными местами")
@CrossOrigin
public class ParkingSpaceController {
    ParkingSpaceServices spaceServices;

    // Создание нового парковочного места
    @Operation(summary = "Create a new parking space")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Parking space created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/create")
    public ResponseEntity<ParkingSpaceDTO> createParkingSpace(@RequestBody ParkingSpaceDTO parkingSpaceDTO) {
        ParkingSpaceDTO createdParkingSpaceDTO = spaceServices.createParkingSpace(parkingSpaceDTO);
        return new ResponseEntity<>(createdParkingSpaceDTO, HttpStatus.CREATED);
    }

    // Получение парковочного места по ID
    @Operation(summary = "Get parking space by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Parking space fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Parking space not found")
    })
    @GetMapping("/getId/{id}")
    public ResponseEntity<ParkingSpaceDTO> getParkingSpaceById(@PathVariable Long id) {
        ParkingSpaceDTO parkingSpace = spaceServices.getParkingSpaceById(id);
        return new ResponseEntity<>(parkingSpace, HttpStatus.OK);
    }

    // Обновление доступности парковочного места
    @Operation(summary = "Update parking space availability")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Parking space availability updated successfully"),
            @ApiResponse(responseCode = "404", description = "Parking space not found")
    })
    @PutMapping("/updateAvailability/{id}")
    public ResponseEntity<ParkingSpaceDTO> updateParkingSpaceAvailability(
            @PathVariable Long id,
            @RequestParam Boolean isAvailable) {
        ParkingSpaceDTO updatedParkingSpace = spaceServices.updateParkingSpaceAvailability(id, isAvailable);
        return new ResponseEntity<>(updatedParkingSpace, HttpStatus.OK);
    }

    // Обновление цены парковочного места
    @Operation(summary = "Update parking space price")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Parking space price updated successfully"),
            @ApiResponse(responseCode = "404", description = "Parking space not found")
    })
    @PutMapping("/updatePrice/{id}")
    public ResponseEntity<ParkingSpaceDTO> updateParkingSpacePrice(
            @PathVariable Long id,
            @RequestParam Integer price) {
        ParkingSpaceDTO updatedParkingSpace = spaceServices.updateParkingSpacePrice(id, price);
        return new ResponseEntity<>(updatedParkingSpace, HttpStatus.OK);
    }

    // Обновление всех данных парковочного места
    @Operation(summary = "Update parking space details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Parking space updated successfully"),
            @ApiResponse(responseCode = "404", description = "Parking space not found")
    })
    @PutMapping("/update/{id}")
    public ResponseEntity<ParkingSpaceDTO> updateParkingSpace(
            @PathVariable Long id,
            @RequestBody ParkingSpaceDTO updatedData) {
        ParkingSpaceDTO updatedParkingSpace = spaceServices.updateParkingSpace(id, updatedData);
        return new ResponseEntity<>(updatedParkingSpace, HttpStatus.OK);
    }

    // Удаление парковочного места
    @Operation(summary = "Delete parking space")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Parking space deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Parking space not found")
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteParkingSpace(@PathVariable Long id) {
        spaceServices.deleteParkingSpace(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Получение парковочных мест в конкретной зоне
    @Operation(summary = "Get parking spaces by parking zone ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Parking spaces fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Parking zone not found")
    })
    @GetMapping("/getByZoneId/{zoneId}")
    public ResponseEntity<List<ParkingSpaceDTO>> getParkingSpacesByZoneId(@PathVariable Long zoneId) {
        List<ParkingSpaceDTO> parkingSpaces = spaceServices.getParkingSpacesByZoneId(zoneId);
        return new ResponseEntity<>(parkingSpaces, HttpStatus.OK);
    }

    // Получение всех парковочных мест с пагинацией
//    @Operation(summary = "Get all parking spaces with pagination")
//    @ApiResponse(responseCode = "200", description = "Successfully fetched all parking spaces")
//    @GetMapping("/getAll")
//    public ResponseEntity<Page<ParkingSpace>> getParkingSpacesWithPagination(Pageable pageable) {
//        Page<ParkingSpace> parkingSpaces = spaceServices.getParkingSpacesWithPagination(pageable);
//        return new ResponseEntity<>(parkingSpaces, HttpStatus.OK);
//    }
}
