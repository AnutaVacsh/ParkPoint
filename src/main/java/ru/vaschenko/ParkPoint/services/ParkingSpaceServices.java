package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDTO;
import ru.vaschenko.ParkPoint.dto.mapper.ParkingSpaceMapper;
import ru.vaschenko.ParkPoint.dto.mapper.ParkingZoneMapping;
import ru.vaschenko.ParkPoint.exception.ParkingSpaceNotFoundException;
import ru.vaschenko.ParkPoint.model.ParkingSpace;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepositories;

import java.util.List;

/*
Создание парковочного места в конкретной зоне.
Получение парковочного места по ID.
Обновление статуса парковочного места (например, изменение доступности или цены).
Удаление парковочного места.
Получение списка парковочных мест в конкретной зоне.
Пагинация
*/

@Service
@AllArgsConstructor
public class ParkingSpaceServices {
    private final ParkingSpaceRepositories spaceRepositories;
    private final ParkingSpaceMapper parkingSpaceMapper;
    private final ParkingZoneMapping parkingZoneMapping;

    // Создание нового парковочного места в конкретной зоне
    public ParkingSpaceDTO createParkingSpace(ParkingSpaceDTO parkingSpaceDTO) {
        ParkingSpace parkingSpace = parkingSpaceMapper.toEntity(parkingSpaceDTO);
        ParkingSpace savedParkingSpace = spaceRepositories.save(parkingSpace);
        return parkingSpaceMapper.toDto(savedParkingSpace);
    }

    // Получение парковочного места по ID
    public ParkingSpaceDTO getParkingSpaceById(Long id) {
        ParkingSpace parkingSpace = spaceRepositories.findById(id)
                .orElseThrow(() -> new ParkingSpaceNotFoundException("Parking space not found with id: " + id));
        return parkingSpaceMapper.toDto(parkingSpace);
    }

    // Обновление доступности и цены парковочного места
    public ParkingSpaceDTO updateParkingSpaceAvailability(Long id, Boolean isAvailable) {
        ParkingSpace parkingSpace = spaceRepositories.findById(id)
                .orElseThrow(() -> new ParkingSpaceNotFoundException("Parking space not found with id: " + id));

        if (isAvailable != null) parkingSpace.setIsAvailable(isAvailable);
        return parkingSpaceMapper.toDto(spaceRepositories.save(parkingSpace));
    }

    public ParkingSpaceDTO updateParkingSpacePrice(Long id, Integer price) {
        ParkingSpace parkingSpace = spaceRepositories.findById(id)
                .orElseThrow(() -> new ParkingSpaceNotFoundException("Parking space not found with id: " + id));

        if (price != null) parkingSpace.setPrice(price);
        return parkingSpaceMapper.toDto(spaceRepositories.save(parkingSpace));
    }

    public ParkingSpaceDTO updateParkingSpace(Long id, ParkingSpaceDTO updatedData) {
        ParkingSpace parkingSpace = spaceRepositories.findById(id)
                .orElseThrow(() -> new ParkingSpaceNotFoundException("Parking space not found with id: " + id));

        parkingSpace.setIsAvailable(updatedData.getIsAvailable());
        parkingSpace.setPrice(updatedData.getPrice());
        parkingSpace.setDescription(updatedData.getDescription());
        parkingSpace.setParkingZone(parkingZoneMapping.toEntity(updatedData.getParkingZoneDTO()));

        return parkingSpaceMapper.toDto(spaceRepositories.save(parkingSpace));
    }

    // Удаление парковочного места
    public void deleteParkingSpace(Long id) {
        validateParkingSpaceExists(id);
        spaceRepositories.deleteById(id);
    }

    // Получение списка парковочных мест в конкретной зоне
    public List<ParkingSpaceDTO> getParkingSpacesByZoneId(Long zoneId) {
        return parkingSpaceMapper.ToDTOs(spaceRepositories.findByParkingZoneId(zoneId));
    }

    // Получение списка парковочных мест с пагинацией
//    public Page<ParkingSpace> getParkingSpacesWithPagination(Pageable pageable) {
//        return spaceRepositories.findAll(pageable);
//    }
//
    private void validateParkingSpaceExists(Long spaceId) {
        if (!spaceRepositories.existsById(spaceId)) {
            throw new ParkingSpaceNotFoundException("Parking space not found with id: " + spaceId);
        }
    }
}
