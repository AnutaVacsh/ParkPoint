package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.ChatDto;
import ru.vaschenko.ParkPoint.dto.MessageDto;
import ru.vaschenko.ParkPoint.dto.request.SaveMessageRequestDto;
import ru.vaschenko.ParkPoint.enams.Role;
import ru.vaschenko.ParkPoint.mappers.ChatMapper;
import ru.vaschenko.ParkPoint.models.Chat;
import ru.vaschenko.ParkPoint.models.Message;
import ru.vaschenko.ParkPoint.models.User;
import ru.vaschenko.ParkPoint.repositories.ChatRepository;
import ru.vaschenko.ParkPoint.repositories.MessageRepository;
import ru.vaschenko.ParkPoint.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMapper chatMapper;
    private final UserRepository userRepository;
    private final UserService userService;
    private final MessageRepository messageRepository;

    public ResponseEntity<List<ChatDto>> getChatList(Long userId) {
        List<Chat> chats = chatRepository.findByOwnerIdOrClientId(userId, userId);
        List<ChatDto> dtoList = chats.stream()
                .map(chatMapper::toChatDto)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    public ResponseEntity<List<MessageDto>> getMessageChat(Long chatId) {
        return chatRepository.findById(chatId)
                .map(chat -> chat.getMessages().stream()
                        .map(chatMapper::toMessageDto)
                        .toList())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public Chat findChatBetweenUsers(Long userId1, Long userId2) {
        return chatRepository.findByUsers(userId1, userId2);
    }

    public Chat createChatBetweenUsers(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new EntityNotFoundException("User 1 not found"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new EntityNotFoundException("User 2 not found"));

        User owner;
        User client;

        // Проверяем комбинации ролей:
        if (user1.getRole() == Role.OWNER && user2.getRole() == Role.CLIENT) {
            owner = user1;
            client = user2;
        } else if (user1.getRole() == Role.CLIENT && user2.getRole() == Role.OWNER) {
            owner = user2;
            client = user1;
        } else if (user1.getRole() == Role.ADMIN && user2.getRole() == Role.ZONE_MANAGER) {
            owner = user1;  // ADMIN - владелец
            client = user2; // ZONE_MANAGER - клиент
        } else if (user1.getRole() == Role.ZONE_MANAGER && user2.getRole() == Role.ADMIN) {
            owner = user2;  // ADMIN - владелец
            client = user1; // ZONE_MANAGER - клиент
        } else {
            throw new IllegalArgumentException("Чат может быть создан только между OWNER и CLIENT или ADMIN и ZONE_MANAGER");
        }

        Chat newChat = new Chat();
        newChat.setOwner(owner);
        newChat.setClient(client);

        return chatRepository.save(newChat);
    }


    public ResponseEntity<MessageDto> saveMessage(SaveMessageRequestDto message) {
        User recipient = userService.findById(message.recipient());
        User sender = userService.findById(message.sender());
        Chat chat = chatRepository.findById(message.chatId()).orElseThrow(() -> new EntityNotFoundException("chat not found"));

        Message sendMessage = new Message();
        sendMessage.setChat(chat);
        sendMessage.setSender(sender);
        sendMessage.setRecipient(recipient);
        sendMessage.setContent(message.content());
        sendMessage.setTime(message.time() != null ? message.time() : LocalDateTime.now());
        sendMessage.setStatus(message.status());

        return ResponseEntity.ok(chatMapper.toMessageDto(messageRepository.save(sendMessage)));
    }

}
