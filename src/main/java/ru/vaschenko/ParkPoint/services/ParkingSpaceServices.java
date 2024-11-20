package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
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

    // Создание нового парковочного места в конкретной зоне
    public ParkingSpace createParkingSpace(ParkingSpace parkingSpace) {
        return spaceRepositories.save(parkingSpace);
    }

    // Получение парковочного места по ID
    public ParkingSpace getParkingSpaceById(Long id) {
        return spaceRepositories.findById(id)
                .orElseThrow(() -> new ParkingSpaceNotFoundException("Parking space not found with id: " + id));
    }

    // Обновление доступности и цены парковочного места
    public ParkingSpace updateParkingSpaceAvailability(Long id, Boolean isAvailable) {
        validateParkingSpaceExists(id);

        ParkingSpace parkingSpace = getParkingSpaceById(id);
        if (isAvailable != null) parkingSpace.setIsAvailable(isAvailable);
        return spaceRepositories.save(parkingSpace);
    }

    public ParkingSpace updateParkingSpacePrice(Long id, Integer price) {
        validateParkingSpaceExists(id);

        ParkingSpace parkingSpace = getParkingSpaceById(id);
        if (price != null) parkingSpace.setPrice(price);
        return spaceRepositories.save(parkingSpace);
    }

    public ParkingSpace updateParkingSpace(Long id, ParkingSpace updatedData) {
        validateParkingSpaceExists(id);

        ParkingSpace parkingSpace = getParkingSpaceById(id);
        parkingSpace.setIsAvailable(updatedData.getIsAvailable());
        parkingSpace.setPrice(updatedData.getPrice());
        parkingSpace.setDescription(updatedData.getDescription());
        parkingSpace.setParkingZone(updatedData.getParkingZone());

        return spaceRepositories.save(parkingSpace);
    }

    // Удаление парковочного места
    public void deleteParkingSpace(Long id) {
        validateParkingSpaceExists(id);
        spaceRepositories.deleteById(id);
    }

    // Получение списка парковочных мест в конкретной зоне
    public List<ParkingSpace> getParkingSpacesByZoneId(Long zoneId) {
        return spaceRepositories.findByParkingZoneId(zoneId);
    }

    // Получение списка парковочных мест с пагинацией
    public Page<ParkingSpace> getParkingSpacesWithPagination(Pageable pageable) {
        return spaceRepositories.findAll(pageable);
    }

    private void validateParkingSpaceExists(Long spaceId) {
        if (!spaceRepositories.existsById(spaceId)) {
            throw new ParkingSpaceNotFoundException("Parking space not found with id: " + spaceId);
        }
    }
}
