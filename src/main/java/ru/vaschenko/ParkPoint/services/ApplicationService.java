package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.request.ApplicationCreateRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.dto.response.ApplicationResponseDto;
import ru.vaschenko.ParkPoint.enams.ApplicationStatus;
import ru.vaschenko.ParkPoint.mappers.ApplicationMapper;
import ru.vaschenko.ParkPoint.models.Application;
import ru.vaschenko.ParkPoint.repositories.ApplicationRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {
    private final ApplicationMapper applicationMapper;
    private final ApplicationRepository applicationRepository;

    public ResponseEntity<ApplicationResponseDto> getApplicationById(Long id) {
        Optional<Application> applicationOpt = applicationRepository.findById(id);
        if (applicationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Application application = applicationOpt.get();
        ApplicationResponseDto dto = applicationMapper.toDto(application);
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<ApplicationResponseDto> createApplication(ApplicationCreateRequestDto dto) {
        log.info("Создание заявки с email={}, title={}", dto.email(), dto.title());
        Application application = applicationMapper.toEntity(dto);
        application.setStatus(ApplicationStatus.UNVIEWED); // всегда при создании статус UNVIEWED
        Application saved = applicationRepository.save(application);
        ApplicationResponseDto responseDto = applicationMapper.toDto(saved);
        log.info("Заявка создана с id={}", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    public Page<ApplicationResponseDto> searchApplications(int page, int size, String sortBy, String sortDirection, List<FilterDTO> filters) {
        Specification<Application> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters != null) {
                for (FilterDTO filter : filters) {
                    if (filter.field() == null || filter.value() == null || "ALL".equalsIgnoreCase(filter.value().toString())) {
                        continue; // пропускаем этот фильтр
                    }

                    switch (filter.operator()) {
                        case "=":
                            predicates.add(cb.equal(root.get(filter.field()), filter.value()));
                            break;
                        case "LIKE":
                            predicates.add(cb.like(cb.lower(root.get(filter.field())), "%" + filter.value().toString().toLowerCase() + "%"));
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

        Page<Application> pageResult = applicationRepository.findAll(spec, pageRequest);

        return pageResult.map(applicationMapper::toDto);
    }



    public ResponseEntity<Void> updateStatus(Long id, ApplicationStatus status) {
        log.info("Обновление статуса заявки id={} на {}", id, status);
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Заявка с id={} не найдена для обновления статуса", id);
                    return new EntityNotFoundException("Заявка с id=" + id + " не найдена");
                });
        application.setStatus(status);
        applicationRepository.save(application);
        log.info("Статус заявки id={} успешно обновлён на {}", id, status);
        return ResponseEntity.noContent().build();
    }
}
