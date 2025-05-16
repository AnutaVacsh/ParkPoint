package ru.vaschenko.ParkPoint.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import ru.vaschenko.ParkPoint.dto.ChatDto;
import ru.vaschenko.ParkPoint.dto.MessageDto;
import ru.vaschenko.ParkPoint.models.Chat;
import ru.vaschenko.ParkPoint.models.Message;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ChatMapper {
    ChatDto toChatDto(Chat chat);

    Chat toChat(ChatDto dto);

    @Mappings({
            @Mapping(source = "chat.id", target = "chatId")
    })
    MessageDto toMessageDto(Message message);

    @Mappings({
            @Mapping(source = "chatId", target = "chat.id")
    })
    Message toMessage(MessageDto dto);
}
