package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.dto.RevParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.UserCardDto;
import ru.vaschenko.ParkPoint.dto.response.UserCardResponseDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.USER)
public interface UserApi {
    @GetMapping(ApiPath.USER_CARDS)
    ResponseEntity<UserCardResponseDto> getUserCards();

    @PostMapping(ApiPath.CREATE_CARD)
    ResponseEntity<String> addUserCard(@RequestBody UserCardDto request);

    @PostMapping(ApiPath.COMPLAINT)
    ResponseEntity<String> submitComplaint(@RequestBody ComplaintDto complaint);

    @PostMapping(ApiPath.REVIEW)
    ResponseEntity<String> submitReview(@RequestBody RevParkingZoneDto review);

    @GetMapping(ApiPath.COMPLAINTS_AGAINST_USER)
    ResponseEntity<List<ComplaintDto>> getComplaintsAgainstUser(@PathVariable Long userId);
}
