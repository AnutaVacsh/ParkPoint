package ru.vaschenko.ParkPoint.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import ru.vaschenko.ParkPoint.model.Owner;
import ru.vaschenko.ParkPoint.model.ParkingSpace;
import ru.vaschenko.ParkPoint.type.StateParkingZone;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class ParkingZoneDTO {
    protected Long id;
    protected OwnerDTO ownerDTO;
    protected String title;
    protected String address;
    protected Double latitude;
    protected Double longitude;
    protected String description;
    protected List<ParkingSpace> parkingSpaces;
    protected List<PhotoDTO> photos;
    protected StateParkingZone state; // 'ACTIVE', 'INACTIVE', 'PENDING'
}
