package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.vaschenko.ParkPoint.dto.BookingDTO;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDTO;
import ru.vaschenko.ParkPoint.dto.ParkingZoneDTO;
import ru.vaschenko.ParkPoint.model.*;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {PhotoMapper.class, ParkingSpaceMapper.class})
public interface ParkingZoneMapping {

    @Mapping(target = "ownerDTO", source = "owner")
    @Mapping(target = "photos", source = "photos")     // ??
    @Mapping(target = "parkingSpaces", source = "parkingSpaces")  // ??
    ParkingZoneDTO toDto(ParkingZone parkingZone);

    // Преобразуем ParkingZoneDTO в ParkingZone
    @Mapping(target = "owner", source = "ownerDTO")
    @Mapping(target = "photos", source = "photos")
    @Mapping(target = "parkingSpaces", source = "parkingSpaces")
    ParkingZone toEntity(ParkingZoneDTO parkingZoneDTO);

    @IterableMapping(elementTargetType = ParkingZoneDTO.class)
    List<ParkingZoneDTO> ToDTOs(List<ParkingZone> clients);
}
