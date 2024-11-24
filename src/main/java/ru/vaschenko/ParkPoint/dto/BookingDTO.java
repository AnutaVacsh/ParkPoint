package ru.vaschenko.ParkPoint.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import ru.vaschenko.ParkPoint.type.StateBooking;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class BookingDTO {
    private Long id;
    private ClientDTO clientDTO; //
    private ParkingSpaceDTO parkingSpaceDTO; //
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime dateCreated;
    private StateBooking status;
}
