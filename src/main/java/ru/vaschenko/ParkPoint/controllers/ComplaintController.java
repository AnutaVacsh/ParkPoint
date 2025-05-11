package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.ComplaintApi;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ComplaintRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.enams.StateComplaint;
import ru.vaschenko.ParkPoint.models.Complaint;
import ru.vaschenko.ParkPoint.services.ComplaintService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class ComplaintController implements ComplaintApi {
    private final ComplaintService complaintService;

    @Override
    public ResponseEntity<ComplaintRequestDto> createComplaint(ComplaintRequestDto requestDTO) {
        return complaintService.createComplaint(requestDTO);
    }

    @Override
    public ResponseEntity<Page<ComplaintDto>> getAllComplaintWithPag(APSearchRequestDto requestDTO) {
        int page = requestDTO.page();
        int size = requestDTO.size();
        String sortDirection = requestDTO.sortDirection();
        String sortBy = requestDTO.sortBy();
        List<FilterDTO> filters = requestDTO.filters();

        Page<ComplaintDto> result = complaintService.searchComplaints(page, size, sortBy, sortDirection, filters);

        return ResponseEntity.ok(result);
    }

    public ResponseEntity<Void> updateComplaintStatus(@RequestParam Long id, @RequestParam StateComplaint newStatus) {
        return complaintService.updateComplaintStatus(id, newStatus);
    }
}
