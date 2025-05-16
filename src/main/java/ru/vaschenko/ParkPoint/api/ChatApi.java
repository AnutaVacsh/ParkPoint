package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.ChatDto;
import ru.vaschenko.ParkPoint.dto.MessageDto;
import ru.vaschenko.ParkPoint.dto.request.SaveMessageRequestDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.CHAT)
public interface ChatApi {
    @GetMapping(ApiPath.CHAT_LIST)
    ResponseEntity<List<ChatDto>> getChatList(@PathVariable Long userId);

    @GetMapping(ApiPath.CHAT_MESSAGE2)
    ResponseEntity<List<MessageDto>> getMessageChat(@PathVariable Long userId1, @PathVariable Long userId2);

    @GetMapping(ApiPath.CHAT_MESSAGE)
    ResponseEntity<List<MessageDto>> getMessageChat(@PathVariable Long chatId);

    @PostMapping(ApiPath.SEND)
    ResponseEntity<MessageDto> saveMessage(@RequestBody SaveMessageRequestDto message);
}
