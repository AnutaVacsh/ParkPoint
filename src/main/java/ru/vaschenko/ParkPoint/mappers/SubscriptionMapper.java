package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.vaschenko.ParkPoint.dto.SubscriptionDto;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionCreateRequestDto;
import ru.vaschenko.ParkPoint.models.Subscription;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ParkingSpaceMapper.class})
public interface SubscriptionMapper {

    @Mapping(target = "parkingSpace", source = "parkingSpace")
    @Mapping(target = "client", source = "client")
    SubscriptionDto toDto(Subscription subscription);

    @Mapping(target = "parkingSpace", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "id", ignore = true)
    Subscription toEntity(SubscriptionCreateRequestDto dto);

    @Mapping(target = "parkingSpaceId", source = "parkingSpace.id")
    @Mapping(target = "clientId", source = "client.id")
    SubscriptionCreateRequestDto toCreateRequestDto(Subscription subscription);
}