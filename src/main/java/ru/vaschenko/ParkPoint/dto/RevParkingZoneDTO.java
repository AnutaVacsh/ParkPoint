package ru.vaschenko.ParkPoint.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class RevParkingZoneDTO {
    private Long id;
    private ParkingZoneDTO parkingZoneDTO; //
    private ClientDTO clientDTO; //
    private String comment;

    @NotBlank(message = "Оценка не может быть null")
    @Size(min = 1, max = 5, message = "Оценка от 1 до 5")
    private Integer rating;
}
