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
import ru.vaschenko.ParkPoint.dto.mapper.UserMapper;
import ru.vaschenko.ParkPoint.exception.ClientNotFoundException;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.repositories.ClientRepositories;
import ru.vaschenko.ParkPoint.type.Role;

import java.util.List;
import java.util.stream.Collectors;

/*
Пагинация
 */

@Slf4j
@Service
@AllArgsConstructor
public class ClientServices {
    private final ClientRepositories clientRepository;
    private final UserMapper clientMapper;
    private final PasswordService passwordService;

    // Создание нового клиента
    public ClientDTO createClient(Client client) {
        client.setRole(Role.CLIENT);
        Password createdPassword = passwordService.createPassword(client.getPassword());
        Client savedClient = clientRepository.save(client);
        return clientMapper.clientToClientDTO(savedClient);
    }

    // Получение клиента по ID
    public ClientDTO getClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .map(clientMapper::clientToClientDTO)
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
        return clientMapper.clientToClientDTO(updatedClient);
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
        return clientMapper.clientsToClientDTOs(clients);
    }

}
