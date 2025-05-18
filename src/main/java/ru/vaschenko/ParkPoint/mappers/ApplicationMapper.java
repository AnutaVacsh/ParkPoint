package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.request.ApplicationCreateRequestDto;
import ru.vaschenko.ParkPoint.dto.response.ApplicationResponseDto;
import ru.vaschenko.ParkPoint.models.Application;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {

    @Mapping(target = "status", expression = "java(ApplicationStatus.UNVIEWED)")
    Application toEntity(ApplicationCreateRequestDto dto);

    ApplicationResponseDto toDto(Application application);
}
