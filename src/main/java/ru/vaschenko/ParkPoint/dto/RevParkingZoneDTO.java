package ru.vaschenko.ParkPoint.dto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class RevParkingZoneDTO {
    private Long id;
    private Long parkingZoneId;
    private Long clientId;
    private String comment;
    private Integer rating; // Оценка от 1 до 5
    private PhotoDTO photo;
}
