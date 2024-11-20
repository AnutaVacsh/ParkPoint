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
import ru.vaschenko.ParkPoint.dto.OwnerDTO;
import ru.vaschenko.ParkPoint.model.Owner;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.services.OwnerServices;
import ru.vaschenko.ParkPoint.services.PasswordService;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/api/owner")
@Tag(name = "Owner API", description = "API для работы с владельцами")
@CrossOrigin
public class OwnerController {
    private final OwnerServices ownerServices;
    private final PasswordService passwordService;

    // Создание нового владельца
    @Operation(summary = "Create a new owner")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Owner created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/create")
    public ResponseEntity<OwnerDTO> createOwner(@RequestBody Owner owner) {
//        Password createdPassword = passwordService.createPassword(owner.getPassword());
        OwnerDTO createdOwner = ownerServices.createOwner(owner);
        return new ResponseEntity<>(createdOwner, HttpStatus.CREATED);
    }

    // Получение владельца по ID
    @Operation(summary = "Get owner by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Owner fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Owner not found")
    })
    @GetMapping("/getId/{id}")
    public ResponseEntity<OwnerDTO> getOwnerById(@PathVariable Long id) {
        OwnerDTO owner = ownerServices.getOwnerById(id);
        return new ResponseEntity<>(owner, HttpStatus.OK);
    }

    // Обновление данных владельца
    @Operation(summary = "Update owner details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Owner updated successfully"),
            @ApiResponse(responseCode = "404", description = "Owner not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/update/{id}")
    public ResponseEntity<OwnerDTO> updateOwner(@PathVariable Long id, @RequestBody OwnerDTO ownerDTO) {
        OwnerDTO updatedOwner = ownerServices.updateOwner(id, ownerDTO);
        return new ResponseEntity<>(updatedOwner, HttpStatus.OK);
    }

    // Удаление владельца
    @Operation(summary = "Delete owner")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Owner deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Owner not found")
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long id) {
        ownerServices.deleteOwner(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Получение всех владельцев
    @Operation(summary = "Get all owners")
    @ApiResponse(responseCode = "200", description = "Successfully fetched all owners")
    @GetMapping("/getAll")
    public ResponseEntity<List<OwnerDTO>> getAllOwners() {
        List<OwnerDTO> owners = ownerServices.getAllOwners();
        return new ResponseEntity<>(owners, HttpStatus.OK);
    }
}
