package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.exception.ParkingSpaceNotFoundException;
import ru.vaschenko.ParkPoint.exception.ParkingZoneNotFoundException;
import ru.vaschenko.ParkPoint.model.ParkingZone;
import ru.vaschenko.ParkPoint.repositories.ParkingZoneRepositories;
import ru.vaschenko.ParkPoint.type.StateParkingZone;

import java.util.List;

/*
Создание парковочной зоны (обычно администратором).
Получение парковочной зоны по ID.
Обновление данных парковочной зоны (например, изменение доступных мест).
Удаление парковочной зоны.
Получение списка всех парковочных зон.
Пагинация
 */

@Service
@AllArgsConstructor
public class ParkingZoneServices {
    private final ParkingZoneRepositories parkingZoneRepository;

    // Создание парковочной зоны
    public ParkingZone createParkingZone(ParkingZone parkingZone) {
        return parkingZoneRepository.save(parkingZone);
    }

    // Получение парковочной зоны по ID
    public ParkingZone getParkingZoneById(Long parkingZoneId) {
        return parkingZoneRepository.findById(parkingZoneId)
                .orElseThrow(() -> new ParkingZoneNotFoundException("Parking Zone not found with id: " + parkingZoneId));
    }

    // Обновление данных парковочной зоны
    @Transactional
    public ParkingZone updateParkingZone(Long parkingZoneId, ParkingZone updatedData) {
        validateParkingZoneExists(parkingZoneId);

        ParkingZone parkingZone = getParkingZoneById(parkingZoneId);
        parkingZone.setTitle(updatedData.getTitle());
        parkingZone.setAddress(updatedData.getAddress());
        parkingZone.setLatitude(updatedData.getLatitude());
        parkingZone.setLongitude(updatedData.getLongitude());
        parkingZone.setState(updatedData.getState());
        parkingZone.setDescription(updatedData.getDescription());
        return parkingZoneRepository.save(parkingZone);
    }

    // Обновление статуса парковочной зоны
    @Transactional
    public ParkingZone updateParkingZoneStatus(Long parkingZoneId, StateParkingZone state) {
        validateParkingZoneExists(parkingZoneId);

        ParkingZone parkingZone = getParkingZoneById(parkingZoneId);
        parkingZone.setState(state);
        return parkingZoneRepository.save(parkingZone);
    }

    // Удаление парковочной зоны
    public void deleteParkingZone(Long parkingZoneId) {
        validateParkingZoneExists(parkingZoneId);

        parkingZoneRepository.deleteById(parkingZoneId);
    }

    // Получение списка всех парковочных зон
    public List<ParkingZone> getAllParkingZones() {
        return parkingZoneRepository.findAll();
    }

    // Получение парковочных зон с пагинацией и фильтрацией
//    public Page<ParkingZone> getParkingZonesWithPaginationAndFilter(Pageable pageable, ParkingZoneSpecifications spec) {
//        return parkingZoneRepository.findAll(spec, pageable);
//    }

    private void validateParkingZoneExists(Long zoneId) {
        if (!parkingZoneRepository.existsById(zoneId)) {
            throw new ParkingSpaceNotFoundException("Parking zone not found with id: " + zoneId);
        }
    }
}
