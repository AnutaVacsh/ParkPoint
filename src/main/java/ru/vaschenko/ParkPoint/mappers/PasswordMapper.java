package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import ru.vaschenko.ParkPoint.dto.PasswordDto;
import ru.vaschenko.ParkPoint.models.Password;

@Mapper(componentModel = "spring")
public interface PasswordMapper {
    Password dtoToPassword(PasswordDto passwordDto);
    PasswordDto PasswordToDto(Password password);
}

