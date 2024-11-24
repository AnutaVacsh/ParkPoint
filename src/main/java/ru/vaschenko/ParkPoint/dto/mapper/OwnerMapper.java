package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.OwnerDTO;
import ru.vaschenko.ParkPoint.model.Owner;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OwnerMapper {
//    @Mapping(target = "password", ignore = true)
    OwnerDTO toDTO(Owner owner);

    Owner toEntity(OwnerDTO ownerDTO);

    List<OwnerDTO> ToDTOs(List<Owner> owners);
}
