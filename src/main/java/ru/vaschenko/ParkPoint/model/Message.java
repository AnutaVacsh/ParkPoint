package ru.vaschenko.ParkPoint.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.*;
import ru.vaschenko.ParkPoint.type.StateMessage;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "Messagee")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_chat")
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "id_sender")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "id_recipient")
    private User recipient;

    private String content;

    private LocalDateTime time;

    @Enumerated(EnumType.STRING)
    private StateMessage status;
}
