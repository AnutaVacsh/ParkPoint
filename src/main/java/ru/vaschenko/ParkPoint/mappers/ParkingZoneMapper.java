package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDto;
import ru.vaschenko.ParkPoint.dto.ParkingZonePartDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneAPDto;
import ru.vaschenko.ParkPoint.dto.response.ParkingZoneResponseDto;
import ru.vaschenko.ParkPoint.enams.StateParkingSpace;
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
            expression = "java(countActiveParkingSpaces(entity))")
    @Mapping(target = "zoneManager", source = "zoneManager.id")
    public abstract ParkingZoneDto toDto(ParkingZone entity);

    @Mapping(target = "parkingSpacesCount", expression = "java(countActiveParkingSpaces(entity))")
    public abstract ParkingZoneResponseDto toResponseDto(ParkingZone entity);

    @Mapping(target = "parkingSpacesCount",
            expression = "java(countActiveParkingSpaces(entity))")
    @Mapping(target = "rev", source = "rev")
    public abstract ParkingZonePartDto toPartDto(ParkingZone entity);

    @Mapping(source = "zoneManager", target = "zoneManager")
    @Mapping(target = "parkingSpacesCount",
            expression = "java(countActiveParkingSpaces(zone))")
    @Mapping(source = "photos", target = "photos")
    public abstract ParkingZoneAPDto parkingZoneToParkingZoneAPDto(ParkingZone zone);

    protected int countActiveParkingSpaces(ParkingZone entity) {
        if (entity.getParkingSpaces() == null) return 0;
        return (int) entity.getParkingSpaces().stream()
                .filter(p -> p.getIsAvailable() == StateParkingSpace.ACTIVE)
                .count();
    }

    @Named("longToUser")
    public User map(Long id) {
        return userService.getOrCreateUser(id);
    }
}
