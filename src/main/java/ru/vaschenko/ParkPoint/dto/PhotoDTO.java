package ru.vaschenko.ParkPoint.dto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class PhotoDTO {
    private Long id;
    private Integer order;
    private String photoUrl;
}
