package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.dto.UserCardDto;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.dto.request.APSearchRequestDto;
import ru.vaschenko.ParkPoint.dto.request.FilterDTO;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneAPDto;
import ru.vaschenko.ParkPoint.dto.response.UserCardResponseDto;
import ru.vaschenko.ParkPoint.mappers.ComplaintMapper;
import ru.vaschenko.ParkPoint.mappers.UserCardMapper;
import ru.vaschenko.ParkPoint.mappers.UserMapper;
import ru.vaschenko.ParkPoint.models.Complaint;
import ru.vaschenko.ParkPoint.models.Password;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.models.UserCard;
import ru.vaschenko.ParkPoint.repositories.ComplaintRepository;
import ru.vaschenko.ParkPoint.repositories.PasswordRepository;
import ru.vaschenko.ParkPoint.repositories.UserCardRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
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

    public Page<UserDto> getAllUsersWithPag(int page, int size, String sortBy, String sortDirection, List<FilterDTO> filters) {
        Specification<User> spec = (root, query, cb) -> {
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

        Page<User> users = userRepository.findAll(spec, pageRequest);

        return users.map(userMapper::userToUserDto);
    }

    public User findBuEmailOrCreate(UserDto userDto) {
        log.debug("find user by email");
        return userRepository.findByEmail(userDto.email())
                .orElseGet(() -> {
                    Password password = new Password();
                    password.setPassword("qwerty");

                    User newUser = new User();
                    newUser.setEmail(userDto.email());
                    newUser.setRole(userDto.role());
                    newUser.setPassword(password);

                    log.debug("user not found, create new user: {}", newUser);
                    return userRepository.save(newUser);
                });
    }

    public ResponseEntity<Void> saveCard(UserCardDto dto) {
        User user = findById(dto.userId());

        UserCard userCard = new UserCard();
        userCard.setEncryptedCard(dto.encryptedCard());
        userCard.setClient(user);
        userCard.setLast4(dto.last4());
        userCard.setExpirationDate(dto.expirationDate());

        userCardRepository.save(userCard);
        log.debug("save card");

        return ResponseEntity.ok().build();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
    }
}