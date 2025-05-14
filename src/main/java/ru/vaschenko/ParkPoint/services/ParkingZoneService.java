package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.dto.request.ParkingZoneCreateDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.enams.Role;
import ru.vaschenko.ParkPoint.enams.StateParkingZone;
import ru.vaschenko.ParkPoint.mappers.ParkingZoneMapper;
import ru.vaschenko.ParkPoint.models.ParkingZone;
import ru.vaschenko.ParkPoint.models.Photo;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.ParkingZoneRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import ru.vaschenko.ParkPoint.repositories.PhotoRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParkingZoneService {
    private final ParkingZoneRepository parkingZoneRepository;
    private final PhotoRepository photoRepository;

    private final UserService userService;

    private final ParkingZoneMapper parkingZoneMapper;


    public ResponseEntity<List<ParkingZoneResponseDto>> getAllParkingZones() {
        return ResponseEntity.ok(parkingZoneRepository.findAll().stream().map(parkingZoneMapper::toResponseDto).toList());
    }

    public ResponseEntity<ParkingZonePartDto> getPartialZoneInfo(Long id) {
        ParkingZone pz = parkingZoneRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Parking zone with id " + id + " not found"));
        return ResponseEntity.ok(parkingZoneMapper.toPartDto(pz));
    }

    public ResponseEntity<ParkingZoneDto> getFullZoneInfo(Long id) {
        ParkingZone pz = parkingZoneRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Parking zone with id " + id + " not found"));
        return ResponseEntity.ok(parkingZoneMapper.toDto(pz));
    }

    public ParkingZone findById(Long id) {
        return parkingZoneRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Parking zone not found with id " + id));
    }

    public Page<ParkingZoneAPDto> searchParkingZones(int page, int size, String sortBy, String sortDirection, List<FilterDTO> filters) {
        Specification<ParkingZone> spec = (root, query, cb) -> {
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

        Page<ParkingZone> zones = parkingZoneRepository.findAll(spec, pageRequest);

        return zones.map(parkingZoneMapper::parkingZoneToParkingZoneAPDto);
    }
    @Transactional
    public void updateStatus(Long id, StateParkingZone newStatus) {
        log.info("update state parking zone with {}", newStatus);
        ParkingZone zone = findById(id);
        zone.setState(newStatus);
        parkingZoneRepository.save(zone);
    }

    @Transactional
    public ResponseEntity<ParkingZone> createParkingZone(ParkingZoneCreateDto dto) {
        log.debug("create parking zone: {}", dto);

        User manager = userService.findBuEmailOrCreate(dto.zoneManager());

        ParkingZone zone = new ParkingZone();
        zone.setZoneManager(manager);
        zone.setTitle(dto.title());
        zone.setAddress(dto.address());
        zone.setDescription(dto.description());
        zone.setMap(dto.map());
        zone.setLatitude(dto.latitude());
        zone.setLongitude(dto.longitude());
        zone.setState(dto.state() != null ? dto.state() : StateParkingZone.ACTIVE);

        ParkingZone savedZone = parkingZoneRepository.save(zone);

        if (dto.photos() != null) {
            List<Photo> photos = dto.photos().stream().map(photoDto -> {
                Photo newPhoto = new Photo();
                newPhoto.setParkingZone(savedZone);
                newPhoto.setOrder(photoDto.order());
                newPhoto.setPhotoUrl(photoDto.photoUrl());
                return newPhoto;
            }).toList();

            savedZone.setPhotos(photoRepository.saveAll(photos));
        }

        log.debug("create new parking zone: {}", savedZone.getId());

        return ResponseEntity.ok(savedZone);
    }
}
