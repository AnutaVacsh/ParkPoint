package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import ru.vaschenko.ParkPoint.api.AuthApi;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.dto.request.OwnerRegisterRequestDto;
import ru.vaschenko.ParkPoint.dto.request.RegisterRequestDto;
import ru.vaschenko.ParkPoint.services.AuthService;

@Controller
@CrossOrigin
@RequiredArgsConstructor
public class AuthController implements AuthApi {
    private final AuthService authService;

    @Override
    public ResponseEntity<UserDto> login(String login, String password) {
        return authService.login(login, password);
    }

    @Override
    public ResponseEntity<UserDto> register(RegisterRequestDto request) {
        return authService.register(request);
    }

    @Override
    public ResponseEntity<UserDto> registerOwner(OwnerRegisterRequestDto request) {
        return authService.registerOwner(request);
    }
}
