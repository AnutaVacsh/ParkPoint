import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useNavigate } from 'react-router-dom';
import '../../css/mapStyle.css'; // подключаем стили

const UserParkingMapPage = () => {
  const [parkingZones, setParkingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  const navigate = useNavigate(); // <-- создали навигатор

  const handlePlacemarkClick = (zone) => {
    setSelectedZone(zone);
  };

  const handleMoreDetails = () => {
    if (selectedZone) {
      navigate(`/client/parking/${selectedZone.id}`); // <-- переход с id парковки
    }
  };

  useEffect(() => {
    const mockParkingZones = [
      {
        id: 1,
        title: "Парковка на проспекте Кирова",
        address: "Проспект Кирова, Саратов",
        parkingSpacesCount: 20,
        latitude: 51.533562,
        longitude: 46.034257,
        rev: [
          {
            id: 1,
            client: { email: "user1@example.com" },
            comment: "Очень удобная парковка, всегда есть места!",
            rating: 4,
            createdAt: "2025-04-26T10:00:00",
          },
          {
            id: 2,
            client: { email: "user1@example.com" },
            comment: "Очень удобная парковка, всегда есть места!",
            rating: 5,
            createdAt: "2025-04-26T10:00:00",
          }
        ],
      },
      {
        id: 2,
        title: "Парковка у набережной",
        address: "Улица Чернышевского, Саратов",
        parkingSpacesCount: 15,
        latitude: 51.530120,
        longitude: 46.014982,
        rev: [
          {
            id: 2,
            client: { email: "user2@example.com" },
            comment: "Парковка не очень удобная, часто занята.",
            rating: 3,
            createdAt: "2025-04-25T14:30:00",
          },
        ],
      },
    ];

    setParkingZones(mockParkingZones);
  }, []);

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
                balloonContent: `${zone.title} - ${zone.address} | Рейтинг: ${zone.rev[0]?.rating || "Нет рейтинга"}`,
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
