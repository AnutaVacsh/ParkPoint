package ru.vaschenko.ParkPoint.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.vaschenko.ParkPoint.model.ParkingZone;
import ru.vaschenko.ParkPoint.services.ParkingZoneServices;
import ru.vaschenko.ParkPoint.type.StateParkingZone;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/api/zone")
@Tag(name = "Zone API", description = "API для работы с парковочными зонами")
@CrossOrigin
public class ParkingZoneController {
    ParkingZoneServices zoneServices;

    @Operation(summary = "Create a new parking zone")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Parking zone created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/create")
    public ResponseEntity<ParkingZone> createParkingZone(@RequestBody ParkingZone parkingZone) {
        ParkingZone createdZone = zoneServices.createParkingZone(parkingZone);
        return new ResponseEntity<>(createdZone, HttpStatus.CREATED);
    }

    // Получение парковочной зоны по ID
    @Operation(summary = "Get parking zone by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Parking zone fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Parking zone not found")
    })
    @GetMapping("/getId/{id}")
    public ResponseEntity<ParkingZone> getParkingZoneById(@PathVariable Long id) {
        ParkingZone parkingZone = zoneServices.getParkingZoneById(id);
        return new ResponseEntity<>(parkingZone, HttpStatus.OK);
    }

    // Обновление данных парковочной зоны
    @Operation(summary = "Update parking zone details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Parking zone updated successfully"),
            @ApiResponse(responseCode = "404", description = "Parking zone not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/update/{id}")
    public ResponseEntity<ParkingZone> updateParkingZone(
            @PathVariable Long id, @RequestBody ParkingZone updatedData) {
        ParkingZone updatedZone = zoneServices.updateParkingZone(id, updatedData);
        return new ResponseEntity<>(updatedZone, HttpStatus.OK);
    }

    // Обновление статуса парковочной зоны
    @PutMapping("/update-status/{id}")
    @Operation(summary = "Update the status of a parking zone")
    public ResponseEntity<ParkingZone> updateParkingZoneStatus(
            @PathVariable Long id, @RequestBody StateParkingZone newStatus) {
        ParkingZone updatedZone = zoneServices.updateParkingZoneStatus(id, newStatus);
        return new ResponseEntity<>(updatedZone, HttpStatus.OK);
    }

    // Удаление парковочной зоны
    @Operation(summary = "Delete parking zone")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Parking zone deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Parking zone not found")
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteParkingZone(@PathVariable Long id) {
        zoneServices.deleteParkingZone(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Получение списка всех парковочных зон
    @Operation(summary = "Get all parking zones")
    @ApiResponse(responseCode = "200", description = "Successfully fetched all parking zones")
    @GetMapping("/getAll")
    public ResponseEntity<List<ParkingZone>> getAllParkingZones() {
        List<ParkingZone> zones = zoneServices.getAllParkingZones();
        return new ResponseEntity<>(zones, HttpStatus.OK);
    }
}
