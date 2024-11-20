package ru.vaschenko.ParkPoint.dto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class ParkingSpaceDTO {
    private Long id;
    private Long parkingZoneId; // Идентификатор парковочной зоны
    private Integer order;
    private Integer price;
    private Boolean isAvailable;
    private String description;
}
