package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.dto.response.UserCardResponseDto;
import ru.vaschenko.ParkPoint.mappers.ComplaintMapper;
import ru.vaschenko.ParkPoint.mappers.UserCardMapper;
import ru.vaschenko.ParkPoint.mappers.UserMapper;
import ru.vaschenko.ParkPoint.models.Complaint;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.ComplaintRepository;
import ru.vaschenko.ParkPoint.repositories.PasswordRepository;
import ru.vaschenko.ParkPoint.repositories.UserCardRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserCardRepository userCardRepository;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;

    private final UserCardMapper userCardMapper;
    private final UserMapper userMapper;
    private final ComplaintMapper complaintMapper;

    public UserDto getUserInfo(Long id){
        return userMapper.userToUserDto(findById(id));
    }

    public User getOrCreateUser(Long id) {
        return userRepository.findById(id)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setId(id);
                    return userRepository.save(newUser);
                });
    }

    public ResponseEntity<List<UserCardResponseDto>> getUserCards(Long id) {
        return ResponseEntity.ok(userCardMapper.toDtoList(userCardRepository.findAllByClientId(id)));
    }

    public ResponseEntity<List<ComplaintDto>> getComplaintsAgainstUser(Long userId) {
        List<Complaint> complaints = complaintRepository.findAllByAccusedId(userId);

        List<ComplaintDto> complaintDtos = complaints.stream()
                .map(complaintMapper::toComplaintDto)
                .toList();

        return ResponseEntity.ok(complaintDtos);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
    }
}