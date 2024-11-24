package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.RevParkingZoneDTO;
import ru.vaschenko.ParkPoint.model.RevParkingZone;

@Mapper(componentModel = "spring", uses = {ClientMapper.class, ParkingZoneMapping.class, PhotoMapper.class})
public interface RevParkingZoneMapper {
    @Mapping(target = "parkingZone", source = "parkingZoneDTO")
    @Mapping(target = "client", source = "clientDTO")
    RevParkingZone toEntity(RevParkingZoneDTO revParkingZoneDTO);

    @Mapping(target = "parkingZoneDTO", source = "parkingZone")
    @Mapping(target = "clientDTO", source = "client")
    RevParkingZoneDTO toDto(RevParkingZone revParkingZone);
}


