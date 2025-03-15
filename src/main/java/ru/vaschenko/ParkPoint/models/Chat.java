package ru.vaschenko.ParkPoint.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Entity
@Table(name = "Chat")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_owner")
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Message> messages;
}
