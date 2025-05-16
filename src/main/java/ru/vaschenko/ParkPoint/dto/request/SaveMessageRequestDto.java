package ru.vaschenko.ParkPoint.dto.request;

import ru.vaschenko.ParkPoint.enams.StateMessage;

import java.time.LocalDateTime;

public record SaveMessageRequestDto(
        Long id,
        Long chatId,
        Long sender,
        Long recipient,
        String content,
        LocalDateTime time,
        StateMessage status
) {
}
