package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ClientDTO;
import ru.vaschenko.ParkPoint.dto.PasswordDTO;
import ru.vaschenko.ParkPoint.dto.SafeUserRequestDTO;
import ru.vaschenko.ParkPoint.dto.mapper.ClientMapper;
import ru.vaschenko.ParkPoint.dto.mapper.PasswordMapper;
import ru.vaschenko.ParkPoint.dto.mapper.SafeUserRequestMapper;
import ru.vaschenko.ParkPoint.exception.ClientNotFoundException;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.repositories.ClientRepositories;
import ru.vaschenko.ParkPoint.type.Role;

import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
@AllArgsConstructor
public class ClientServices {
    private final ClientRepositories clientRepository;
    private final ClientMapper clientMapper;
    private final PasswordMapper passwordMapper;
    private final PasswordService passwordService;
    private final SafeUserRequestMapper safeUserRequestMapper;

    // Создание нового клиента
    public ClientDTO createClient(SafeUserRequestDTO safeUserRequestDTO) {
        safeUserRequestDTO.setRole(Role.CLIENT);
        PasswordDTO passwordDTO = passwordService.createPassword(safeUserRequestDTO.getPasswordDTO());
        safeUserRequestDTO.setPasswordDTO(passwordDTO);
        log.info("Сохраняем клиента {}", safeUserRequestDTO.getId());

        Client savedClient = clientRepository.save(safeUserRequestMapper.toClientEntity(safeUserRequestDTO));
        return clientMapper.toDTO(savedClient);
    }

    // Получение клиента по ID
    public ClientDTO getClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .map(clientMapper::toDTO)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with id: " + clientId));
    }

    // Обновление данных клиента
    @Transactional
    public ClientDTO updateClient(Long clientId, ClientDTO clientDTO) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with id: " + clientId));

        client.setEmail(clientDTO.getEmail());
        client.setPhoneNumber(clientDTO.getPhoneNumber());
        Client updatedClient = clientRepository.save(client);
        return clientMapper.toDTO(updatedClient);
    }


    // Удаление клиента
    public void deleteClient(Long clientId) {
        if (!clientRepository.existsById(clientId)) {
            throw new ClientNotFoundException("Client not found with id: " + clientId);
        }
        clientRepository.deleteById(clientId);
    }

//    public Page<Student> getStudents(Specification<StudentEntity> spec, Pageable pageable) {
//        Page<StudentEntity> studentsPage = studentRepository.findAll(spec, pageable);
//        return studentsPage.map(mapper::entityToDto);
//    }
//
//    public Page<Student> getStudents(Pageable pageable) {
//        Page<StudentEntity> studentsPage = studentRepository.findAll(pageable);
//        return studentsPage.map(mapper::entityToDto);
//    }

    // Получение всех клиентов
    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clientMapper.ToDTOs(clients);
    }

}
