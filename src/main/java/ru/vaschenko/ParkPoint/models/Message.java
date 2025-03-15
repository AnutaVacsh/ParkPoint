package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.*;
import ru.vaschenko.ParkPoint.enams.StateMessage;

@Entity
@Data
@Table(name = "Messagee")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_chat")
    @JsonBackReference
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
