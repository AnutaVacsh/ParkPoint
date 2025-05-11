package ru.vaschenko.ParkPoint.mappers;

import lombok.extern.slf4j.Slf4j;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDto;
import ru.vaschenko.ParkPoint.dto.request.ParkingSpaceRequestDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingSpaceAPDto;
import ru.vaschenko.ParkPoint.models.ParkingSpace;
import ru.vaschenko.ParkPoint.models.ParkingZone;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.services.ParkingZoneService;
import ru.vaschenko.ParkPoint.services.UserService;

@Slf4j
@Mapper(componentModel = "spring", uses = { ParkingZoneMapper.class, UserMapper.class })
public abstract class ParkingSpaceMapper {

    @Autowired
    protected UserService userService;

    @Autowired
    protected ParkingZoneService parkingZoneService;

    @Mapping(source = "owner.id", target = "idOwner")
    @Mapping(source = "parkingZone", target = "parkingZoneDto")
    public abstract ParkingSpaceDto parkingSpaceToParkingSpaceDto(ParkingSpace parkingSpace);

    @Mapping(source = "idOwner", target = "owner.id")
    @Mapping(source = "parkingZoneDto", target = "parkingZone")
    public abstract ParkingSpace parkingSpaceDtoToParkingSpace(ParkingSpaceDto parkingSpaceDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", expression = "java(owner)")
    @Mapping(target = "parkingZone", expression = "java(resolveParkingZone(parkingSpaceRequestDto.parkingZoneId()))")
    public abstract ParkingSpace requestDtoToEntity(ParkingSpaceRequestDto parkingSpaceRequestDto, User owner);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", expression = "java(resolveOwner(parkingSpaceRequestDto.idOwner()))")
    @Mapping(target = "parkingZone", expression = "java(resolveParkingZone(parkingSpaceRequestDto.parkingZoneId()))")
    public abstract ParkingSpace requestDtoToEntity(ParkingSpaceRequestDto parkingSpaceRequestDto);

    @Mapping(source = "owner", target = "owner")
    @Mapping(source = "parkingZone", target = "parkingZoneDto")
    public abstract ParkingSpaceAPDto parkingSpaceToParkingSpaceAPDto(ParkingSpace parkingSpace);

    protected ParkingZone resolveParkingZone(Long zoneId) {
        if (zoneId == null) {
            log.warn("Parking Zone ID is null");
            return null;
        }
        ParkingZone zone = parkingZoneService.findById(zoneId);
        if (zone == null) {
            log.warn("Parking Zone with ID {} not found", zoneId);
        }
        return zone;
    }

    protected User resolveOwner(Long ownerId) {
        if (ownerId == null) {
            log.warn("Owner ID is null");
            return null;
        }
        User owner = userService.findById(ownerId);
        if (owner == null) {
            log.warn("Owner with ID {} not found", ownerId);
        }
        return owner;
    }
}
