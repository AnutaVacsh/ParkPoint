package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.PasswordRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getOrCreateUser(Long id) {
        return userRepository.findById(id)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setId(id);
                    return userRepository.save(newUser);
                });
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
    }
}