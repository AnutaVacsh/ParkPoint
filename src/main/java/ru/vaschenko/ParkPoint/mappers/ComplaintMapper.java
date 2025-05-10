package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.ComplaintDto;
import ru.vaschenko.ParkPoint.models.Complaint;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ComplaintMapper {

    @Mapping(source = "complainant", target = "complainant")
    @Mapping(source = "accused", target = "accused")
    ComplaintDto toComplaintDto(Complaint complaint);
}