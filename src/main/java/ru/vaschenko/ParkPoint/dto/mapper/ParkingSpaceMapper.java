package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.vaschenko.ParkPoint.dto.BookingDTO;
import ru.vaschenko.ParkPoint.dto.ParkingSpaceDTO;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.model.ParkingSpace;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ParkingZoneMapping.class})
public interface ParkingSpaceMapper {
    @Mapping(target = "parkingZone", source = "parkingZoneDTO")
    ParkingSpace toEntity(ParkingSpaceDTO dto);

    @Mapping(target = "parkingZoneDTO", source = "parkingZone")
    ParkingSpaceDTO toDto(ParkingSpace entity);

    @IterableMapping(elementTargetType = ParkingSpaceDTO.class)
    List<ParkingSpaceDTO> ToDTOs(List<ParkingSpace> clients);
}
