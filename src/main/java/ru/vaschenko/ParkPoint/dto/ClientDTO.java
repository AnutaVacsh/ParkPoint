package ru.vaschenko.ParkPoint.dto;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class ClientDTO{
    protected Long id;
    protected String email;
    protected String role;
    private String phoneNumber;
}
