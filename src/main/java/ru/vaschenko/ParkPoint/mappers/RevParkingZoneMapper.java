package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import ru.vaschenko.ParkPoint.dto.RevParkingZoneDto;
import ru.vaschenko.ParkPoint.models.RevParkingZone;

@Mapper(componentModel = "spring")
public interface RevParkingZoneMapper {
    RevParkingZoneDto toDto(RevParkingZone entity);
}
