package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import ru.vaschenko.ParkPoint.dto.PhotoDto;
import ru.vaschenko.ParkPoint.models.Photo;
import ru.vaschenko.ParkPoint.models.ParkingZone;

//@Mapper(componentModel = "spring")
//public interface PhotoMapper {
//
//    @Mapping(target = "id", ignore = true)
//    @Mapping(target = "parkingZone", source = "parkingZone")
//    Photo toEntity(PhotoDto dto, ParkingZone parkingZone);
//
//    @Mapping(target = "parkingZoneId", source = "parkingZone.id", qualifiedByName = "mapParkingZoneId")
//    PhotoDto toDto(Photo entity);
//
//    @Named("mapParkingZoneId")
//    default Long mapParkingZoneId(ParkingZone parkingZone) {
//        return parkingZone != null ? parkingZone.getId() : null;
//    }
//
//    default void updateEntityFromDto(PhotoDto dto, @MappingTarget Photo entity) {
//        if (dto == null) return;
//
//        if (dto.order() != null) {
//            entity.setOrder(dto.order());
//        }
//        if (dto.photoUrl() != null) {
//            entity.setPhotoUrl(dto.photoUrl());
//        }
//    }
//}