package ru.vaschenko.ParkPoint.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.dto.request.OwnerRegisterRequestDto;
import ru.vaschenko.ParkPoint.dto.request.RegisterRequestDto;
import ru.vaschenko.ParkPoint.enams.Role;
import ru.vaschenko.ParkPoint.exeptions.UnauthorizedException;
import ru.vaschenko.ParkPoint.mappers.ParkingSpaceMapper;
import ru.vaschenko.ParkPoint.mappers.PasswordMapper;
import ru.vaschenko.ParkPoint.mappers.UserMapper;
import ru.vaschenko.ParkPoint.models.ParkingSpace;
import ru.vaschenko.ParkPoint.models.Password;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;
import ru.vaschenko.ParkPoint.repositories.PasswordRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final PasswordRepository passwordRepository;

    private final UserMapper userMapper;
    private final PasswordMapper passwordMapper;
    private final ParkingSpaceMapper parkingSpaceMapper;

    public ResponseEntity<UserDto> login(String login, String password) {
        logger.info("Attempting to log in user with email: {}", login);

        User user = userRepository.findByEmailAndPassword(login, password)
                .orElseThrow(() -> {
                    logger.error("Login failed for email: {}. Invalid credentials.", login);
                    return new UnauthorizedException("Неверный логин или пароль");
                });

        logger.info("User successfully logged in: {}", user.getEmail());
        return ResponseEntity.ok(userMapper.userToUserDto(user));
    }

    public ResponseEntity<UserDto> register(RegisterRequestDto request) {
        logger.info("Attempting to register a new user with email: {}", request.email());

        checkIfEmailExists(request.email());

        Password password = new Password();
        password.setPassword(request.password());
        logger.info("Password successfully set for new user");

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(password);
        user.setRole(Role.CLIENT);
        logger.info("User entity created with email: {} and role: {}", request.email(), Role.CLIENT);

        User savedUser = userRepository.save(user);
        logger.info("New user registered with id: {}", savedUser.getId());

        return ResponseEntity.ok(userMapper.userToUserDto(savedUser));
    }

    public ResponseEntity<UserDto> registerOwner(OwnerRegisterRequestDto request) {
        logger.info("Attempting to register a new owner with email: {}", request.registerRequestDto().email());

        checkIfEmailExists(request.registerRequestDto().email());

        Password password = new Password();
        password.setPassword(request.registerRequestDto().password());
        logger.info("Password successfully set for new owner");

        User owner = new User();
        owner.setEmail(request.registerRequestDto().email());
        owner.setPassword(password);
        owner.setRole(Role.OWNER);
        logger.info("Owner entity created with email: {} and role: {}", request.registerRequestDto().email(), Role.OWNER);

        User savedOwner = userRepository.save(owner);
        logger.info("New owner registered with id: {}", savedOwner.getId());

        ParkingSpace parkingSpace = parkingSpaceMapper.parkingSpaceDtoToParkingSpace(request.parkingSpaceDto());
        parkingSpace.setOwner(savedOwner);
        logger.info("Parking space associated with owner id: {}", savedOwner.getId());

        parkingSpaceRepository.save(parkingSpace);
        logger.info("Parking space saved with id: {}", parkingSpace.getId());

        return ResponseEntity.ok(userMapper.userToUserDto(savedOwner));
    }

    private void checkIfEmailExists(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            logger.error("Email already exists: {}", email);
            throw new UnauthorizedException("Пользователь с таким email уже существует");
        }
        logger.info("No user found with email: {}. Proceeding with registration.", email);
    }
}
