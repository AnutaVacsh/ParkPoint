package ru.vaschenko.ParkPoint.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.dto.SubscriptionDto;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionCreateRequestDto;
import ru.vaschenko.ParkPoint.mappers.SubscriptionMapper;
import ru.vaschenko.ParkPoint.models.Subscription;
import ru.vaschenko.ParkPoint.repositories.SubscriptionRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionMapper subscriptionMapper;

    public ResponseEntity<List<SubscriptionDto>> getUserSubscriptions(Long userId) {
        log.debug("get user subscription {}", userId);
        return ResponseEntity.ok(subscriptionRepository
                .findByClientId(userId)
                .stream().map(subscriptionMapper::toDto).toList());
    }

    public ResponseEntity<SubscriptionDto> getSubscriptionById(Long id) {
        return ResponseEntity.ok(subscriptionMapper.toDto(getById(id)));
    }

    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
        log.debug("get all subscription");
        return ResponseEntity.ok(subscriptionRepository.findAll().stream().map(subscriptionMapper::toDto).toList());
    }

    public ResponseEntity<SubscriptionDto> createSubscriptions(SubscriptionCreateRequestDto createRequestDto){
        Subscription subscription = subscriptionMapper.toEntity(createRequestDto);
        subscription = subscriptionRepository.save(subscription);
        log.debug("Save subscription: {}", subscription);
        return ResponseEntity.ok(subscriptionMapper.toDto(subscription));
    }

    private Subscription getById(Long id){
        log.debug("Looking for subscription with ID: {}", id);
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("subscription not found"));
    }
}
