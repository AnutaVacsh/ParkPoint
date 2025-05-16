package ru.vaschenko.ParkPoint.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.vaschenko.ParkPoint.dto.SubscriptionDto;
import ru.vaschenko.ParkPoint.dto.request.SubscriptionCreateRequestDto;
import ru.vaschenko.ParkPoint.util.ApiPath;

import java.util.List;

@RequestMapping(ApiPath.SUBSCRIPTION)
public interface SubscriptionApi {

    @GetMapping(ApiPath.SUBSCRIPTION_GET_USER)
    public ResponseEntity<List<SubscriptionDto>> getUserSubscriptions(@PathVariable Long userId);

    @GetMapping(ApiPath.SUBSCRIPTION_GET_ID)
    public ResponseEntity<SubscriptionDto> getSubscriptionById(@PathVariable Long id);

    @GetMapping(ApiPath.SUBSCRIPTION_GET_ALL)
    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions();

    @GetMapping(ApiPath.SUBSCRIPTION_GET_ALL_OWNER)
    public ResponseEntity<List<SubscriptionDto>> getOwnerSubscriptions(@PathVariable("ownerId") Long ownerId);

    @PostMapping(ApiPath.SUBSCRIPTION_CREATE)
    public ResponseEntity<SubscriptionDto> createSubscriptions(@RequestBody SubscriptionCreateRequestDto createRequestDto);
}
