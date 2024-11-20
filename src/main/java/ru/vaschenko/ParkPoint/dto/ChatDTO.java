package ru.vaschenko.ParkPoint.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class ChatDTO {
    private Long id;
    private Long ownerId;
    private Long clientId;
    private List<MessageDTO> messages;
}
