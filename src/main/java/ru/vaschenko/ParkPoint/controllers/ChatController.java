package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.ChatApi;
import ru.vaschenko.ParkPoint.dto.ChatDto;
import ru.vaschenko.ParkPoint.dto.MessageDto;
import ru.vaschenko.ParkPoint.dto.request.SaveMessageRequestDto;
import ru.vaschenko.ParkPoint.models.Chat;
import ru.vaschenko.ParkPoint.services.ChatService;

import java.util.Collections;
import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
public class ChatController implements ChatApi {
    private final ChatService chatService;

    @Override
    public ResponseEntity<List<ChatDto>> getChatList(Long userId) {
        return chatService.getChatList(userId);
    }

    @Override
    public ResponseEntity<List<MessageDto>> getMessageChat(Long userId1, Long userId2) {

        Chat chat = chatService.findChatBetweenUsers(userId1, userId2);

        if (chat == null) {
            chat = chatService.createChatBetweenUsers(userId1, userId2);
            return ResponseEntity.ok(Collections.emptyList());
        }

        return chatService.getMessageChat(chat.getId());
    }

    @Override
    public ResponseEntity<List<MessageDto>> getMessageChat(Long chatId) {
        return chatService.getMessageChat(chatId);
    }

    @Override
    public ResponseEntity<MessageDto> saveMessage(SaveMessageRequestDto message) {
        return chatService.saveMessage(message);
    }
}
