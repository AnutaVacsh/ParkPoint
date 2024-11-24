package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ru.vaschenko.ParkPoint.dto.AdminDTO;
import ru.vaschenko.ParkPoint.model.Admin;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    AdminDTO toDTO(Admin admin);

    Admin toEntity(AdminDTO adminDTO);
}
