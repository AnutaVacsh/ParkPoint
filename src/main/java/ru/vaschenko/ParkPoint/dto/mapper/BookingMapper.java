package ru.vaschenko.ParkPoint.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.vaschenko.ParkPoint.dto.BookingDTO;
import ru.vaschenko.ParkPoint.model.Booking;
import ru.vaschenko.ParkPoint.type.Role;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.awt.print.Book;
@Mapper(componentModel = "spring", uses = {ParkingSpaceMapper.class, ClientMapper.class})
public interface BookingMapper {
    @Mapping(target = "clientDTO", source = "client")
    @Mapping(target = "parkingSpaceDTO", source = "parkingSpace")
    BookingDTO toDTO(Booking booking);

    // Преобразование DTO в сущность
    @Mapping(target = "client", source = "clientDTO") // Клиент маппится отдельно
    @Mapping(target = "parkingSpace", source = "parkingSpaceDTO") // Используем вложенный маппер
    Booking toEntity(BookingDTO bookingDTO);

}
