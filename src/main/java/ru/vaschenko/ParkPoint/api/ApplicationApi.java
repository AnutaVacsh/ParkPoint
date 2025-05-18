package ru.vaschenko.ParkPoint.api;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ApplicationCreateRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SearchRequestDTO;
import ru.vaschenko.ParkPoint.dto.response.ApplicationResponseDto;
import ru.vaschenko.ParkPoint.enams.ApplicationStatus;
import ru.vaschenko.ParkPoint.util.ApiPath;

@RequestMapping(ApiPath.APPLICATION)
public interface ApplicationApi {
    @GetMapping(ApiPath.APPLICATION_GET_ID)
    ResponseEntity<ApplicationResponseDto> getApplicationById(@Valid @PathVariable Long id);

    @PostMapping(ApiPath.APPLICATION_CREATE)
    ResponseEntity<ApplicationResponseDto> createApplication(@Valid @RequestBody ApplicationCreateRequestDto dto);

    @PostMapping(ApiPath.APPLICATION_GET_ALL_PAG)
    ResponseEntity<Page<ApplicationResponseDto>> getAllApplications(@Valid @RequestBody APSearchRequestDto request);

    @PutMapping(ApiPath.APPLICATION_STATUS)
    ResponseEntity<Void>  updateStatus(@PathVariable Long id, @RequestBody ApplicationStatus status);
}
