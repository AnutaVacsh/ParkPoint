package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.vaschenko.ParkPoint.dto.UserDto;
import ru.vaschenko.ParkPoint.dto.request.RegisterRequestDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

@RequestMapping(ApiPath.AUTH)
public interface AuthApi {
    @GetMapping(ApiPath.CLIENT_LOGIN)
    ResponseEntity<UserDto> login(@RequestParam String login, @RequestParam String password);

    @PostMapping(ApiPath.CLIENT_REGISTER)
    ResponseEntity<UserDto> register(@RequestBody RegisterRequestDto request);
}
