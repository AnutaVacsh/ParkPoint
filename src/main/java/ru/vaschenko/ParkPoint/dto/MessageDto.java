package ru.vaschenko.ParkPoint.dto;

import ru.vaschenko.ParkPoint.enams.StateMessage;

import java.time.LocalDateTime;

public record MessageDto(
        Long id,
        Long chatId,
        UserDto sender,
        UserDto recipient,
        String content,
        LocalDateTime time,
        StateMessage status
) {
}
