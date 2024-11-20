package ru.vaschenko.ParkPoint.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Setter @Getter
public class OwnerDTO{
    protected Long id;
    protected String email;
    protected String role;
    private String phoneNumber;
}
