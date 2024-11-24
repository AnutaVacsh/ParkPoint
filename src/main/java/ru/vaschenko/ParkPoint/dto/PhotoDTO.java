package ru.vaschenko.ParkPoint.dto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class PhotoDTO {
    protected Long id;
    protected Integer order;
    protected ParkingZoneDTO parkingZoneDTO;
    protected String photoUrl;
}
