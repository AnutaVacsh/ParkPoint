package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.vaschenko.ParkPoint.dto.PhotoDTO;
import ru.vaschenko.ParkPoint.model.ParkingZone;
import ru.vaschenko.ParkPoint.model.Photo;

@Mapper(componentModel = "spring")
public interface PhotoMapper {
    @Mapping(target = "parkingZoneDTO", source = "parkingZone")
    PhotoDTO toDto(Photo photo);

    // Преобразуем DTO PhotoDTO в сущность Photo
    @Mapping(target = "parkingZone", source = "parkingZoneDTO")
    Photo toEntity(PhotoDTO photoDTO);

}
