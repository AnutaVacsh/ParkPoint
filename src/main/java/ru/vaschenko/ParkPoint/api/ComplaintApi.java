package ru.vaschenko.ParkPoint.api;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ComplaintRequestDto;
import ru.vaschenko.ParkPoint.enams.StateComplaint;
import ru.vaschenko.ParkPoint.util.ApiPath;

@RequestMapping(ApiPath.BASE_COMPLAINT)
public interface ComplaintApi {

    @PostMapping(ApiPath.COMPLAINT_CREATE)
    ResponseEntity<ComplaintRequestDto> createComplaint(@RequestBody ComplaintRequestDto requestDTO);

    @PostMapping(ApiPath.COMPLAINT_PAG)
    ResponseEntity<Page<ComplaintDto>> getAllComplaintWithPag(@RequestBody APSearchRequestDto requestDTO);

    @PutMapping(ApiPath.COMPLAINT_UPDATE_STATUS)
    ResponseEntity<Void> updateComplaintStatus(@RequestParam Long id, @RequestParam StateComplaint newStatus);
}
