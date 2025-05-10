package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import ru.vaschenko.ParkPoint.dto.response.UserCardResponseDto;
import ru.vaschenko.ParkPoint.models.UserCard;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserCardMapper {
    UserCardResponseDto toDto(UserCard userCard);

    List<UserCardResponseDto> toDtoList(List<UserCard> userCards);
}
