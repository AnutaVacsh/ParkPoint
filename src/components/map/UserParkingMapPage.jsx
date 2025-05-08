import React, { useContext, useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useNavigate } from 'react-router-dom';
import '../../css/mapStyle.css'; // подключаем стили
import { mockParkingZones } from '../../dto/mock/mockParkingZones';
import { UserContext } from '../../contexts/UserContext';

const UserParkingMapPage = () => {
  const [parkingZones, setParkingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const handlePlacemarkClick = async (zone) => {
    try {
      const response = await fetch(`http://localhost:8080/parking-zones/get/${zone.id}/partial`);
      if (!response.ok) throw new Error('Ошибка загрузки зоны');
      const data = await response.json();
      setSelectedZone(data);
      console.log(selectedZone);
    } catch (error) {
      console.warn(`Не удалось загрузить зону ${zone.id}, используем данные с карты`);
      setSelectedZone(zone);
    }
  };

  const handleMoreDetails = () => {
    if (selectedZone) {
      user === "CLIENT" ? navigate(`/client/parking/${selectedZone.id}`) : navigate(`/owner/parking/${selectedZone.id}`);
    }
  };

  useEffect(() => {
    const fetchParkingZones = async () => {
      try {
        const response = await fetch('http://localhost:8080/parking-zones/get/list');
        if (!response.ok) throw new Error();
        const data = await response.json();
        console.log(data);
        setParkingZones(data);
      } catch (error) {
        console.warn('Ошибка при загрузке парковок, используем моки');
        setParkingZones(mockParkingZones);
      }
    };
  
    fetchParkingZones();
  }, []);

  useEffect(() => {
    console.log("Обновленные parkingZones:", parkingZones);
  }, [parkingZones]);

  useEffect(() => {
    console.log("Обновленный selectedZone:", selectedZone);
  }, [selectedZone]);

  const renderStars = (rating) => {
    if (isNaN(rating) || rating < 0 || rating > 5) {
      return <span>Нет рейтинга</span>;
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">&#9733;</span>
        ))}
        {hasHalfStar && <span className="star half">&#9733;</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">&#9734;</span>
        ))}
      </>
    );
  };

  // Функция для расчета среднего рейтинга
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  return (
    <div className="mapPageContainer">
      <YMaps>
        <Map defaultState={{ center: [51.533562, 46.034257], zoom: 13 }} width="100%" height="100%">
          {parkingZones.map((zone) => (
            <Placemark
              key={zone.id}
              geometry={[zone.latitude, zone.longitude]}
              properties={{
                iconContent: `${zone.parkingSpacesCount} мест`,
                // balloonContent: `${zone.title} - ${zone.address} | Рейтинг: ${zone.revzone.rev[0]?.rating || "Нет рейтинга"}`,
              }}
              options={{
                preset: 'islands#blueCircleIconWithCaption',
                cursor: 'pointer',
              }}
              onClick={() => handlePlacemarkClick(zone)}
            />
          ))}
        </Map>
      </YMaps>

      {selectedZone && (
        <div className="infoPanel">
          <div className="infoLeft">
            <h2 className="zoneTitle">{selectedZone.title}</h2>
            <p className="zoneAddress">{selectedZone.address}</p>
            <p className="zoneSpaces">Мест: {selectedZone.parkingSpacesCount}</p>
            
            <button className="detailsButton" onClick={handleMoreDetails}>Подробнее</button>
          </div>

          <div className="infoRight">
            <h3 className="reviewsTitle">Отзывы</h3>
            {/* Общий рейтинг парковки */}
            {selectedZone.rev.length > 0 && (
              <div className="ratingContainer">
                <div className="stars">
                  {renderStars(calculateAverageRating(selectedZone.rev))}
                </div>
                <div className="ratingNumber">
                  {calculateAverageRating(selectedZone.rev).toFixed(1)}
                </div>
              </div>
            )}
            {/* Последний отзыв */}
            {selectedZone.rev.length > 0 && (
              <div className="reviewContainer">
                <p className="reviewUser">
                  {selectedZone.rev[selectedZone.rev.length - 1].client ? 
                    selectedZone.rev[selectedZone.rev.length - 1].client.email : "Неизвестный пользователь"}
                </p>
                <div className="stars">
                  {renderStars(selectedZone.rev[selectedZone.rev.length - 1].rating)}
                </div>
                <p className="reviewText">
                  "{selectedZone.rev[selectedZone.rev.length - 1].comment}"
                </p>
                <p className="reviewDate">
                  {new Date(selectedZone.rev[selectedZone.rev.length - 1].createdAt).toLocaleString()}
                </p>
              </div>
            )}
            <button className="allReviewsButton">Смотреть все отзывы</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserParkingMapPage;
