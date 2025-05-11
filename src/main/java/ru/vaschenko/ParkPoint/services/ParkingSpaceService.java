package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.dto.request.ParkingSpaceRequestDto;
import ru.vaschenko.ParkPoint.dto.request.ParkingSpaceUpdateRequestDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceBookingDto;
import ru.vaschenko.ParkPoint.enams.StateParkingSpace;
import ru.vaschenko.ParkPoint.mappers.ParkingSpaceMapper;
import ru.vaschenko.ParkPoint.models.ParkingSpace;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParkingSpaceService {
    private final BookingService bookingService;
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final ParkingSpaceMapper parkingSpaceMapper;

    public ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceIntoZone(Long parkingZoneId) {
        log.info("getParkingSpaceIntoZone called with parkingZoneId: {}", parkingZoneId);
        List<ParkingSpace> ps = parkingSpaceRepository.findByParkingZoneId(parkingZoneId);
        log.debug("Все места зоны {}", parkingZoneId);
        return ResponseEntity.ok(ps.stream().map(parkingSpaceMapper::parkingSpaceToParkingSpaceDto).toList());
    }

    public ResponseEntity<List<ParkingSpaceBookingDto>> getParkingSpaceToBookingIntoZone(Long parkingZoneId) {
        log.info("getParkingSpaceToBookingIntoZone called with parkingZoneId: {}", parkingZoneId);
        List<ParkingSpace> ps = parkingSpaceRepository.findByParkingZoneId(parkingZoneId);
        log.debug("Все места зоны {}", parkingZoneId);

        List<ParkingSpaceBookingDto> psbd = ps.stream()
                .map(p -> new ParkingSpaceBookingDto(
                        parkingSpaceMapper.parkingSpaceToParkingSpaceDto(p),
                        bookingService.getTimeSlotForParkingSpace(p.getId())))
                .toList();

        return ResponseEntity.ok(psbd);
    }

    public ResponseEntity<ParkingSpaceDto> getParkingSpaceById(Long id){
        log.info("getParkingSpaceById called with id: {}", id);
        ParkingSpace ps = getById(id);
        return ResponseEntity.ok(parkingSpaceMapper.parkingSpaceToParkingSpaceDto(ps));
    }

    public ResponseEntity<List<ParkingSpaceDto>> getParkingSpaceByUserId(Long ownerId){
        log.info("getParkingSpaceByUserId called with ownerId: {}", ownerId);
        List<ParkingSpace> ps = parkingSpaceRepository.findByOwnerId(ownerId);
        return ResponseEntity.ok(ps.stream().map(parkingSpaceMapper::parkingSpaceToParkingSpaceDto).toList());
    }

    public ResponseEntity<ParkingSpaceDto> updateParkingSpace(ParkingSpaceUpdateRequestDto parkingSpaceDto) {
        log.info("updateParkingSpace called with dto: {}", parkingSpaceDto);
        ParkingSpace ps = getById(parkingSpaceDto.id());
        ps.setDailyPrice(parkingSpaceDto.dailyPrice());
        ps.setHourlyPrice(parkingSpaceDto.hourlyPrice());
        ps.setWeeklyPrice(parkingSpaceDto.weeklyPrice());
        ps.setMonthlyPrice(parkingSpaceDto.monthlyPrice());
        ps.setDescription(parkingSpaceDto.description());

        ps = parkingSpaceRepository.save(ps);
        log.info("update parking space {}", ps);
        return ResponseEntity.ok(parkingSpaceMapper.parkingSpaceToParkingSpaceDto(ps));
    }

    public ResponseEntity<ParkingSpaceDto> updateState(Long id, StateParkingSpace newState) {
        log.info("updateParkingSpace status id: {} new state: {}", id, newState);

        ParkingSpace ps = getById(id);
        ps.setIsAvailable(newState);
        ps = parkingSpaceRepository.save(ps);

        log.info("update parking space {}", ps);
        return ResponseEntity.ok(parkingSpaceMapper.parkingSpaceToParkingSpaceDto(ps));
    }

    public ResponseEntity<ParkingSpaceDto> createParkingSpace(ParkingSpaceRequestDto parkingSpaceDto) {
        log.info("createParkingSpace called with dto: {}", parkingSpaceDto);
        ParkingSpace ps = parkingSpaceRepository.save(parkingSpaceMapper.requestDtoToEntity(parkingSpaceDto));
        return ResponseEntity.ok(parkingSpaceMapper.parkingSpaceToParkingSpaceDto(ps));
    }

    public Page<ParkingSpaceAPDto> searchParkingSpaces(int page, int size, String sortBy, String sortDirection, List<FilterDTO> filters) {
        Specification<ParkingSpace> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters != null) {
                for (FilterDTO filter : filters) {
                    if (filter.field() == null || filter.value() == null || "ALL".equalsIgnoreCase(filter.value().toString())) {
                        continue; // пропускаем фильтр
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

        Page<ParkingSpace> parkingSpaces = parkingSpaceRepository.findAll(spec, pageRequest);

        return parkingSpaces.map(parkingSpaceMapper::parkingSpaceToParkingSpaceAPDto);
    }



    private ParkingSpace getById(Long id){
        log.info("getById called with id: {}", id);
        return parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Parking space not found"));
    }
}
