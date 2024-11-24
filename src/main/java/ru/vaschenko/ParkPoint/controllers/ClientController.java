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
import ru.vaschenko.ParkPoint.dto.ClientDTO;
import ru.vaschenko.ParkPoint.dto.SafeUserRequestDTO;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.services.ClientServices;
import ru.vaschenko.ParkPoint.services.PasswordService;
import ru.vaschenko.ParkPoint.type.Role;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/api/client")
@Tag(name = "Client API", description = "API для работы с клиентами")
@CrossOrigin
public class ClientController {
    ClientServices clientServices;
    PasswordService passwordService;

    // Создание нового клиента
    @Operation(summary = "Create a new client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Client created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/create")
    public ResponseEntity<ClientDTO> createClient(@RequestBody SafeUserRequestDTO client) {
        ClientDTO createdClient = clientServices.createClient(client);
        return new ResponseEntity<>(createdClient, HttpStatus.CREATED);
    }

    // Получение клиента по ID
    @Operation(summary = "Get client by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @GetMapping("/getId/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        ClientDTO client = clientServices.getClientById(id);
        return new ResponseEntity<>(client, HttpStatus.OK);
    }

    // Обновление клиента
    @Operation(summary = "Update client details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client updated successfully"),
            @ApiResponse(responseCode = "404", description = "Client not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/update/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @RequestBody ClientDTO clientDTO) {
        ClientDTO updatedClient = clientServices.updateClient(id, clientDTO);
        return new ResponseEntity<>(updatedClient, HttpStatus.OK);
    }

    // Удаление клиента
    @Operation(summary = "Delete client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Client deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientServices.deleteClient(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Получение всех клиентов
    @Operation(summary = "Get all clients")
    @ApiResponse(responseCode = "200", description = "Successfully fetched all clients")
    @GetMapping("/getAll")
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        List<ClientDTO> clients = clientServices.getAllClients();
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }
}
