package ru.vaschenko.ParkPoint.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import ru.vaschenko.ParkPoint.enams.StateComplaint;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "complaint")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_complainant")
    private User complainant;

    @ManyToOne
    @JoinColumn(name = "id_accused")
    private User accused;

    private String text;

    @Enumerated(EnumType.STRING)
    private StateComplaint status = StateComplaint.PENDING;

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "id_booking")
    private Long bookingId;
}
