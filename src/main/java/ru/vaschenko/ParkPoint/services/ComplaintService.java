package ru.vaschenko.ParkPoint.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.RequestParam;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.dto.request.ComplaintRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.enams.StateComplaint;
import ru.vaschenko.ParkPoint.mappers.ComplaintMapper;
import ru.vaschenko.ParkPoint.models.Complaint;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.ComplaintRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final ComplaintMapper complaintMapper;
    private final UserRepository userRepository;

    public ResponseEntity<ComplaintRequestDto> createComplaint(ComplaintRequestDto requestDTO) {
        User complainant = userRepository.findById(requestDTO.complainantId())
                .orElseThrow(() -> new RuntimeException("Жалобщик не найден"));
        User accused = userRepository.findById(requestDTO.accusedId())
                .orElseThrow(() -> new RuntimeException("Обвиняемый не найден"));

        Complaint complaint = new Complaint();
        complaint.setComplainant(complainant);
        complaint.setAccused(accused);
        complaint.setText(requestDTO.text());

        complaintRepository.save(complaint);

        return ResponseEntity.ok(requestDTO);
    }

    public Page<ComplaintDto> searchComplaints(int page, int size, String sortBy, String sortDirection, List<FilterDTO> filters) {
        Specification<Complaint> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters != null) {
                for (FilterDTO filter : filters) {
                    if (filter.field() == null || filter.value() == null || "ALL".equalsIgnoreCase(filter.value().toString())) {
                        continue;
                    }

                    switch (filter.operator()) {
                        case "=":
                            predicates.add(cb.equal(root.get(filter.field()), filter.value()));
                            break;
                        case "LIKE":
                            predicates.add(cb.like(root.get(filter.field()), "%" + filter.value() + "%"));
                            break;
                        default:
                            throw new IllegalArgumentException("Unsupported operator: " + filter.operator());
                    }
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        if (sortBy == null || sortBy.trim().isEmpty()) {
            throw new IllegalArgumentException("Sort field cannot be null or empty.");
        }

        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        PageRequest pageRequest = PageRequest.of(page - 1, size, sort);

        Page<Complaint> complaints = complaintRepository.findAll(spec, pageRequest);

        return complaints.map(complaintMapper::toComplaintDto);
    }

    public ResponseEntity<Void> updateComplaintStatus(@RequestParam Long id, @RequestParam StateComplaint newStatus) {
        Optional<Complaint> complaintOptional = complaintRepository.findById(id);
        if (complaintOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Complaint complaint = complaintOptional.get();
        complaint.setStatus(newStatus);
        complaintRepository.save(complaint);

        return ResponseEntity.ok().build();
    }
}
