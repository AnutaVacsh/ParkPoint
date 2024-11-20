package ru.vaschenko.ParkPoint.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import ru.vaschenko.ParkPoint.type.StateMessage;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter @Getter
public class MessageDTO {
    private Long id;
    private Long chatId;
    private Long senderId;
    private Long recipientId;
    private String content;
    private LocalDateTime time;
    private String status; // 'SENT', 'READ', 'FAILED', 'DELETED'
}
