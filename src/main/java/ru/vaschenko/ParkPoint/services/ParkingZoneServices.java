package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDTO;
import ru.vaschenko.ParkPoint.dto.mapper.ParkingSpaceMapper;
import ru.vaschenko.ParkPoint.dto.mapper.ParkingZoneMapping;
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
    private final ParkingZoneMapping parkingZoneMapper;

    // Создание парковочной зоны
    public ParkingZoneDTO createParkingZone(ParkingZoneDTO parkingZoneDTO) {
        ParkingZone savedParkingZone = parkingZoneRepository.save(parkingZoneMapper.toEntity(parkingZoneDTO));
        return parkingZoneMapper.toDto(savedParkingZone);
    }

    // Получение парковочной зоны по ID
    public ParkingZoneDTO getParkingZoneById(Long parkingZoneId) {
        ParkingZone parkingZone = parkingZoneRepository.findById(parkingZoneId)
                .orElseThrow(() -> new ParkingZoneNotFoundException("Parking Zone not found with id: " + parkingZoneId));
        return parkingZoneMapper.toDto(parkingZone);
    }

    // Обновление данных парковочной зоны
    @Transactional
    public ParkingZoneDTO updateParkingZone(Long parkingZoneId, ParkingZoneDTO updatedData) {
        ParkingZone parkingZone = parkingZoneRepository.findById(parkingZoneId)
                .orElseThrow(() -> new ParkingZoneNotFoundException("Parking Zone not found with id: " + parkingZoneId));

        parkingZone.setTitle(updatedData.getTitle());
        parkingZone.setAddress(updatedData.getAddress());
        parkingZone.setLatitude(updatedData.getLatitude());
        parkingZone.setLongitude(updatedData.getLongitude());
        parkingZone.setState(updatedData.getState());
        parkingZone.setDescription(updatedData.getDescription());

        return parkingZoneMapper.toDto(parkingZoneRepository.save(parkingZone));
    }

    // Обновление статуса парковочной зоны
    @Transactional
    public ParkingZoneDTO updateParkingZoneStatus(Long parkingZoneId, StateParkingZone state) {
        ParkingZone parkingZone = parkingZoneRepository.findById(parkingZoneId)
                .orElseThrow(() -> new ParkingZoneNotFoundException("Parking Zone not found with id: " + parkingZoneId));

        parkingZone.setState(state);
        return parkingZoneMapper.toDto(parkingZoneRepository.save(parkingZone));
    }

    // Удаление парковочной зоны
    public void deleteParkingZone(Long parkingZoneId) {
        validateParkingZoneExists(parkingZoneId);

        parkingZoneRepository.deleteById(parkingZoneId);
    }

    // Получение списка всех парковочных зон
    public List<ParkingZoneDTO> getAllParkingZones() {
        return parkingZoneMapper.ToDTOs(parkingZoneRepository.findAll());
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
