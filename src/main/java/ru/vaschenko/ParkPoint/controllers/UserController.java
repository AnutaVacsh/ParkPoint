package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.UserApi;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.dto.RevParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.UserCardDto;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneAPDto;
import ru.vaschenko.ParkPoint.dto.response.UserCardResponseDto;
import ru.vaschenko.ParkPoint.services.UserService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class UserController implements UserApi {
    private final UserService userService;

    @Override
    public ResponseEntity<UserDto> getUserInfo(Long userId) {
        return ResponseEntity.ok(userService.getUserInfo(userId));
    }

    @Override
    public ResponseEntity<List<UserCardResponseDto>> getUserCards(Long userId) {
        return userService.getUserCards(userId);
    }

    @Override
    public ResponseEntity<String> addUserCard(UserCardDto request) {
        return null;
    }

    @Override
    public ResponseEntity<String> submitComplaint(ComplaintDto complaint) {
        return null;
    }

    @Override
    public ResponseEntity<String> submitReview(RevParkingZoneDto review) {
        return null;
    }

    @Override
    public ResponseEntity<List<ComplaintDto>> getComplaintsAgainstUser(Long userId) {
        return userService.getComplaintsAgainstUser(userId);
    }

    @Override
    public ResponseEntity<Page<UserDto>> getAllUsersWithPag(APSearchRequestDto requestDTO) {
        int page = requestDTO.page();
        int size = requestDTO.size();
        String sortDirection = requestDTO.sortDirection();
        String sortBy = requestDTO.sortBy();
        List<FilterDTO> filters = requestDTO.filters();

        Page<UserDto> result = userService.getAllUsersWithPag(page, size, sortBy, sortDirection, filters);

        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> saveCard(UserCardDto dto) {
        return userService.saveCard(dto);
    }
}
