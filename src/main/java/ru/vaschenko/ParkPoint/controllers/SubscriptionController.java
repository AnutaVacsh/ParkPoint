package ru.vaschenko.ParkPoint.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ru.vaschenko.ParkPoint.api.SubscriptionApi;
import ru.vaschenko.ParkPoint.dto.SubscriptionDto;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionCreateRequestDto;
import ru.vaschenko.ParkPoint.models.Subscription;
import ru.vaschenko.ParkPoint.services.SubscriptionService;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class SubscriptionController implements SubscriptionApi {
    private final SubscriptionService subscriptionService;

    @Override
    public ResponseEntity<List<SubscriptionDto>> getUserSubscriptions(Long userId) {
        return subscriptionService.getUserSubscriptions(userId);
    }

    @Override
    public ResponseEntity<SubscriptionDto> getSubscriptionById(Long id) {
        return subscriptionService.getSubscriptionById(id);
    }

    @Override
    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    @Override
    public ResponseEntity<SubscriptionDto> createSubscriptions(SubscriptionCreateRequestDto createRequestDto) {
        return subscriptionService.createSubscriptions(createRequestDto);
    }
}
