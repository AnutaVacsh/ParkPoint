package ru.vaschenko.ParkPoint.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.PasswordDTO;
import ru.vaschenko.ParkPoint.dto.mapper.PasswordMapper;
import ru.vaschenko.ParkPoint.model.ParkingZone;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.repositories.PasswordRepositories;

@Slf4j
@Service
@AllArgsConstructor
public class PasswordService {
    private final PasswordRepositories passwordRepositories;
    private final PasswordMapper passwordMapper;

    public PasswordDTO createPassword(PasswordDTO passwordDTO) {
        Password password = passwordMapper.toEntity(passwordDTO);
        password = passwordRepositories.save(password);
        log.info("сохранён пароль{}", password.getId());
        return passwordMapper.toDto(password);
    }
}
