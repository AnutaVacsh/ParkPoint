package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.request.ParkingZoneCreateDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.models.ParkingZone;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.services.UserService;

@Mapper(componentModel = "spring", uses = {RevParkingZoneMapper.class, UserMapper.class})
public abstract class ParkingZoneMapper {
    @Autowired
    private UserService userService;

    @Mapping(target = "zoneManager", source = "zoneManager", qualifiedByName = "longToUser")
    public abstract ParkingZone toEntity(ParkingZoneDto dto);

    @Mapping(target = "parkingSpacesCount",
            expression = "java(entity.getParkingSpaces() != null ? entity.getParkingSpaces().size() : 0)")
    @Mapping(target = "zoneManager", source = "zoneManager.id")
    public abstract ParkingZoneDto toDto(ParkingZone entity);

    @Mapping(target = "parkingSpacesCount",
            expression = "java(entity.getParkingSpaces() != null ? entity.getParkingSpaces().size() : 0)")
    public abstract ParkingZoneResponseDto toResponseDto(ParkingZone entity);

    @Mapping(target = "parkingSpacesCount",
            expression = "java(entity.getParkingSpaces() != null ? entity.getParkingSpaces().size() : 0)")
    @Mapping(target = "rev", source = "rev")
    public abstract ParkingZonePartDto toPartDto(ParkingZone entity);

    @Mapping(source = "zoneManager", target = "zoneManager")
    @Mapping(target = "parkingSpacesCount", expression = "java(zone.getParkingSpaces() != null ? zone.getParkingSpaces().size() : 0)")
    @Mapping(source = "photos", target = "photos")
    public abstract ParkingZoneAPDto parkingZoneToParkingZoneAPDto(ParkingZone zone);

//    public abstract ParkingZone toEntityFromCreateDto(ParkingZoneCreateDto dto);

    @Named("longToUser")
    public User map(Long id) {
        return userService.getOrCreateUser(id);
    }
}
