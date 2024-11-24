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
import ru.vaschenko.ParkPoint.dto.BookingDTO;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.services.BookingService;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/api/booking")
@Tag(name = "Booking API", description = "API для работы с бронированиями")
@CrossOrigin
public class BookingController {
    BookingService bookingService;

    // Создание нового бронирования
    @Operation(summary = "Create a new booking")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Booking created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/create")
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO booking) {
        BookingDTO createdBookingDTO = bookingService.createClient(booking);
        return new ResponseEntity<>(createdBookingDTO, HttpStatus.CREATED);
    }

    // Получение бронирования по ID
    @Operation(summary = "Get booking by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @GetMapping("/getId/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

//    // Получение всех бронирований с пагинацией и фильтрацией по статусу
//    @Operation(summary = "Get all bookings with pagination and status filter")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Successfully fetched all bookings"),
//            @ApiResponse(responseCode = "400", description = "Invalid status")
//    })
//    @GetMapping("/getAllWithStatus")
//    public ResponseEntity<Page<Booking>> getBookingsWithPaginationAndStatus(
//            @RequestParam("status") StateBooking status, Pageable pageable) {
//        Page<Booking> bookings = bookingService.getBookingsWithPaginationAndStatus(pageable, status);
//        return new ResponseEntity<>(bookings, HttpStatus.OK);
//    }
//
//    // Получение всех бронирований с пагинацией
//    @Operation(summary = "Get all bookings with pagination")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Successfully fetched all bookings")
//    })
//    @GetMapping("/getAll")
//    public ResponseEntity<Page<Booking>> getAllBookings(Pageable pageable) {
//        Page<Booking> bookings = bookingService.getAllBookings(pageable);
//        return new ResponseEntity<>(bookings, HttpStatus.OK);
//    }

    // Обновление статуса бронирования
    @Operation(summary = "Update booking status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status")
    })
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long id, @RequestParam StateBooking status) {
        BookingDTO updatedBooking = bookingService.updateBookingStatus(id, status);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    // Удаление бронирования
    @Operation(summary = "Delete booking")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Booking deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Получение бронирований клиента
    @Operation(summary = "Get bookings by client ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bookings fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @GetMapping("/getByClientId/{clientId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByClientId(@PathVariable Long clientId) {
        List<BookingDTO> bookings = bookingService.getBookingsByClientId(clientId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    // Получение бронирований владельца
    @Operation(summary = "Get bookings by owner ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bookings fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Owner not found")
    })
    @GetMapping("/getByOwnerId/{ownerId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByOwnerId(@PathVariable Long ownerId) {
        List<BookingDTO> bookings = bookingService.getBookingsByOwnerId(ownerId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    // Получение бронирований на определённое место
    @Operation(summary = "Get bookings by parking space ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bookings fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Parking space not found")
    })
    @GetMapping("/getByParkingSpaceId/{parkingSpaceId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByParkingSpaceId(@PathVariable Long parkingSpaceId) {
        List<BookingDTO> bookings = bookingService.getBookingsByParkingSpaceId(parkingSpaceId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
}
