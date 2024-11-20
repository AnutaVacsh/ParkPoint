package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ClientDTO;
import ru.vaschenko.ParkPoint.dto.OwnerDTO;
import ru.vaschenko.ParkPoint.dto.mapper.UserMapper;
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

@Service
@AllArgsConstructor
public class OwnerServices {
    private final OwnerRepositories ownerRepository;
    private final UserMapper ownerMapper;
    private final PasswordService passwordService;

    // Создание нового клиента
    public OwnerDTO createOwner(Owner owner) {
        owner.setRole(Role.OWNER);
        Password savedPassword = passwordService.createPassword(owner.getPassword());
        Owner savedOwner = ownerRepository.save(owner);
        return ownerMapper.ownerToOwnerDTO(savedOwner);
    }

    // Получение владельца по ID
    public OwnerDTO getOwnerById(Long ownerId) {
        return ownerRepository.findById(ownerId)
                .map(ownerMapper::ownerToOwnerDTO)
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
        return ownerMapper.ownerToOwnerDTO(updatedOwner);
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
        return ownerMapper.ownersToOwnerDTOs(owners);
    }
}
