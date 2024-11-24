package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.PasswordDTO;
import ru.vaschenko.ParkPoint.dto.PhotoDTO;
import ru.vaschenko.ParkPoint.dto.SafeUserRequestDTO;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.Owner;
import ru.vaschenko.ParkPoint.model.Photo;

@Mapper(componentModel = "spring", uses = PasswordMapper.class)
public interface SafeUserRequestMapper {
    @Mapping(target = "password", source = "passwordDTO")
    Owner toOwnerEntity(SafeUserRequestDTO safeUserRequestDTO);

    @Mapping(target = "password", source = "passwordDTO")
    Client toClientEntity(SafeUserRequestDTO safeUserRequestDTO);
}
