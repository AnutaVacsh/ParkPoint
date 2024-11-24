package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ClientDTO;
import ru.vaschenko.ParkPoint.dto.OwnerDTO;
import ru.vaschenko.ParkPoint.dto.PasswordDTO;
import ru.vaschenko.ParkPoint.dto.SafeUserRequestDTO;
import ru.vaschenko.ParkPoint.dto.mapper.OwnerMapper;
import ru.vaschenko.ParkPoint.dto.mapper.PasswordMapper;
import ru.vaschenko.ParkPoint.dto.mapper.SafeUserRequestMapper;
import ru.vaschenko.ParkPoint.exception.OwnerNotFoundException;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.Owner;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.repositories.OwnerRepositories;
import ru.vaschenko.ParkPoint.repositories.PasswordRepositories;
import ru.vaschenko.ParkPoint.type.Role;

import java.util.List;

/*
Пагинация
 */

@Slf4j
@Service
@AllArgsConstructor
public class OwnerServices {
    private final OwnerRepositories ownerRepository;
    private final OwnerMapper ownerMapper;
    private final PasswordService passwordService;
    private final PasswordMapper passwordMapper;
    private final SafeUserRequestMapper safeUserRequestMapper;

    // Создание нового клиента
    public OwnerDTO createOwner(SafeUserRequestDTO safeUserRequestDTO) {
        safeUserRequestDTO.setRole(Role.OWNER);
        PasswordDTO passwordDTO = passwordService.createPassword(safeUserRequestDTO.getPasswordDTO());
        safeUserRequestDTO.setPasswordDTO(passwordDTO);
        log.info("Сохраняем владельца {}", safeUserRequestDTO.getId());

        Owner savedOwner = ownerRepository.save(safeUserRequestMapper.toOwnerEntity(safeUserRequestDTO));
        return ownerMapper.toDTO(savedOwner);
    }

    // Получение владельца по ID
    public OwnerDTO getOwnerById(Long ownerId) {
        return ownerRepository.findById(ownerId)
                .map(ownerMapper::toDTO)
                .orElseThrow(() -> new OwnerNotFoundException("Owner not found with id: " + ownerId));
    }

    // Обновление данных владельца
    @Transactional
    public OwnerDTO updateOwner(Long ownerId, OwnerDTO ownerDTO) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new OwnerNotFoundException("Owner not found with id: " + ownerId));

        owner.setPhoneNumber(ownerDTO.getPhoneNumber());
        owner.setEmail(ownerDTO.getEmail());
        Owner updatedOwner = ownerRepository.save(owner);
        return ownerMapper.toDTO(updatedOwner);
    }

    // Удаление владельца
    public void deleteOwner(Long ownerId) {
        if (!ownerRepository.existsById(ownerId)) {
            throw new OwnerNotFoundException("Owner not found with id: " + ownerId);
        }
        ownerRepository.deleteById(ownerId);
    }

    // Получение всех владельцев
    public List<OwnerDTO> getAllOwners() {
        List<Owner> owners = ownerRepository.findAll();
        return ownerMapper.ToDTOs(owners);
    }
}
