package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.ApplicationApi;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ApplicationCreateRequestDto;
import ru.vaschenko.ParkPoint.dto.request.SearchRequestDTO;
import ru.vaschenko.ParkPoint.dto.response.ApplicationResponseDto;
import ru.vaschenko.ParkPoint.enams.ApplicationStatus;
import ru.vaschenko.ParkPoint.services.ApplicationService;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class ApplicationController implements ApplicationApi {
    private final ApplicationService applicationService;

    @Override
    public ResponseEntity<ApplicationResponseDto> getApplicationById(Long id) {
        return applicationService.getApplicationById(id);
    }

    @Override
    public ResponseEntity<ApplicationResponseDto> createApplication(ApplicationCreateRequestDto dto) {
        return applicationService.createApplication(dto);
    }

    @Override
    public ResponseEntity<Page<ApplicationResponseDto>> getAllApplications(APSearchRequestDto request) {
        Page<ApplicationResponseDto> result = applicationService.searchApplications(
                request.page(),
                request.size(),
                request.sortBy(),
                request.sortDirection(),
                request.filters()
        );

        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> updateStatus(Long id, ApplicationStatus status) {
        return applicationService.updateStatus(id, status);
    }
}
