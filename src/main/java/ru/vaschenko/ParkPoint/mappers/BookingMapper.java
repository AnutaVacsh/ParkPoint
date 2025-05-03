package ru.vaschenko.ParkPoint.mappers;

import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.*;
import ru.vaschenko.ParkPoint.dto.BookingDto;
import ru.vaschenko.ParkPoint.dto.request.BookingRequestDto;
import ru.vaschenko.ParkPoint.models.Booking;
import ru.vaschenko.ParkPoint.models.ParkingSpace;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.ParkingSpaceRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ParkingSpaceMapper.class})
public interface BookingMapper {

    BookingDto toDto(Booking entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", source = "clientId", qualifiedByName = "idToUser")
    @Mapping(target = "parkingSpace", source = "parkingSpaceId", qualifiedByName = "idToParkingSpace")
    @Mapping(target = "dateCreated", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "price", source = "price")
    Booking toEntity(BookingRequestDto dto,
                     @Context UserRepository userRepository,
                     @Context ParkingSpaceRepository parkingSpaceRepository);

    @Named("idToUser")
    default User idToUser(Long id, @Context UserRepository userRepository) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Named("idToParkingSpace")
    default ParkingSpace idToParkingSpace(Long id, @Context ParkingSpaceRepository parkingSpaceRepository) {
        return parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ParkingSpace not found with id: " + id));
    }
}