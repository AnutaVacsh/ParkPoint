package ru.vaschenko.ParkPoint.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.model.ParkingZone;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.repositories.PasswordRepositories;

@Service
@AllArgsConstructor
public class PasswordService {
    PasswordRepositories passwordRepositories;

    public Password createPassword(Password password) {
        return passwordRepositories.save(password);
    }
}
