package ru.vaschenko.ParkPoint.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.vaschenko.ParkPoint.exception.RevParkZoneNotFoundException;
import ru.vaschenko.ParkPoint.model.Client;
import ru.vaschenko.ParkPoint.model.RevParkingZone;
import ru.vaschenko.ParkPoint.repositories.RevParkingZoneRepositories;

@Service
@AllArgsConstructor
public class RevParkZoneService {
    private final RevParkingZoneRepositories revRepositories;

    public RevParkingZone createRev(RevParkingZone rev) {
        return revRepositories.save(rev);
    }

    // Изменение отзыва
    public RevParkingZone updateRev(Long id, RevParkingZone updatedRev) {
        RevParkingZone existingRev = revRepositories.findById(id)
                .orElseThrow(() -> new RevParkZoneNotFoundException("RevParkingZone not found with id " + id));

        existingRev.setComment(updatedRev.getComment());
        existingRev.setRating(updatedRev.getRating());

        return revRepositories.save(existingRev);
    }

    // Удаление отзыва
    public void deleteRev(Long id) {
        validateRevExists(id);
        RevParkingZone existingRev = revRepositories.findById(id)
                .orElseThrow(() -> new RevParkZoneNotFoundException("RevParkingZone not found with id " + id));
        revRepositories.delete(existingRev);
    }

    // Установка только оценки
    public RevParkingZone createRating(int rating, Client client) {
        RevParkingZone existingRev = new RevParkingZone();

        existingRev.setClient(client);
        existingRev.setRating(rating);
        return revRepositories.save(existingRev);
    }

    // Получение всех отзывов для конкретной зоны с пагинацией и сортировкой
//    public Page<RevParkingZone> getAllReviewsForZone(Long zoneId, Pageable pageable) {
//        return revRepositories.findByParkingZoneId(zoneId, pageable);
//    }

    private void validateRevExists(Long revId) {
        if (!revRepositories.existsById(revId)) {
            throw new RevParkZoneNotFoundException("Review not found with id: " + revId);
        }
    }
}
