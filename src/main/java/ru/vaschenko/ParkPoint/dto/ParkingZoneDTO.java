package ru.vaschenko.ParkPoint.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import ru.vaschenko.ParkPoint.type.StateParkingZone;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class ParkingZoneDTO {
    private Long id;
    private String title;
    private String address;
    private Double latitude;
    private Double longitude;
    private String description;
    private List<PhotoDTO> photos;

    @Enumerated(EnumType.STRING)
    private StateParkingZone state; // 'ACTIVE', 'INACTIVE', 'PENDING'
}
