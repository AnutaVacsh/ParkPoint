package ru.vaschenko.ParkPoint.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.RevParkingZone;
import ru.vaschenko.ParkPoint.repositories.RevParkingZoneRepositories;
import ru.vaschenko.ParkPoint.services.RevParkZoneService;

/*
изменить
удалить
поставить только оценку
посмотреть все отзывы для конкретной зоны
пагинация, сортировка и т.д.
 */

@Controller
@AllArgsConstructor
@RequestMapping("/api/rev")
@Tag(name = "Review API", description = "API для работы с отзывами на парковочные зоны")
@CrossOrigin
public class RevParkZoneController {
    private final RevParkZoneService revParkZoneService;

    @Operation(summary = "Create a new rev")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Parking zone created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/create")
    public RevParkingZone createRev(@RequestBody RevParkingZone rev) {
        return revParkZoneService.createRev(rev);
    }

    @Operation(summary = "Update a review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @PutMapping("/update/{id}")
    public RevParkingZone updateRev(@PathVariable Long id, @RequestBody RevParkingZone updatedRev) {
        return revParkZoneService.updateRev(id, updatedRev);
    }

    @Operation(summary = "Delete a review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @DeleteMapping("/delete/{id}")
    public void deleteRev(@PathVariable Long id) {
        revParkZoneService.deleteRev(id);
    }

    @Operation(summary = "create Rating")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review rating create"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @PostMapping("/createRating/{id}")
    public RevParkingZone createRating(@RequestParam int rating, @RequestParam Client client) {
        return revParkZoneService.createRating(rating, client);
    }

//    @Operation(summary = "Get all reviews for a specific parking zone")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
//            @ApiResponse(responseCode = "404", description = "Parking zone not found")
//    })
//    @GetMapping("/reviews/{zoneId}")
//    public Page<RevParkingZone> getAllReviewsForZone(@PathVariable Long zoneId, Pageable pageable) {
//        return revParkZoneService.getAllReviewsForZone(zoneId, pageable);
//    }
}
