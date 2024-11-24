package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import ru.vaschenko.ParkPoint.dto.PasswordDTO;
import ru.vaschenko.ParkPoint.model.Password;

@Mapper(componentModel = "spring")
public interface PasswordMapper {

    PasswordDTO toDto(Password password);
    Password toEntity(PasswordDTO passwordDTO);
}
