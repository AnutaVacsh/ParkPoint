package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.models.ParkingSpace;

@Mapper(componentModel = "spring", uses = { ParkingZoneMapper.class })
public interface ParkingSpaceMapper {

    @Mapping(source = "owner.id", target = "idOwner")
    @Mapping(source = "parkingZone", target = "parkingZoneDto")
    ParkingSpaceDto parkingSpaceToParkingSpaceDto(ParkingSpace parkingSpace);

    @Mapping(source = "idOwner", target = "owner.id")
    @Mapping(source = "parkingZoneDto", target = "parkingZone")
    ParkingSpace parkingSpaceDtoToParkingSpace(ParkingSpaceDto parkingSpaceDto);
}
