import React, { useContext, useEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useNavigate } from 'react-router-dom';
import '../../css/mapStyle.css';
import { mockParkingZones } from '../../dto/mock/mockParkingZones';
import { UserContext } from '../../contexts/UserContext';

const UserParkingMapPage = () => {
  const [parkingZones, setParkingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const mapRef = useRef(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchPlacemarkCoords, setSearchPlacemarkCoords] = useState(null);
  const [nearestZones, setNearestZones] = useState([]);

  useEffect(() => {
    const fetchParkingZones = async () => {
      try {
        const response = await fetch('http://localhost:8080/parking-zones/get/list');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setParkingZones(data);
      } catch (error) {
        console.warn('Ошибка при загрузке парковок, используем моки');
        setParkingZones(mockParkingZones);
      }
    };

    fetchParkingZones();
  }, []);

  const findNearestZones = async (coords) => {
    try {
      const response = await fetch('http://localhost:8080/parking-zones/nearest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude: coords[0], longitude: coords[1] })
      });

      if (!response.ok) throw new Error();
      const data = await response.json(); // массив зон
      setNearestZones(data);
    } catch (e) {
      console.warn('Ошибка при поиске ближайших зон:', e);
      setNearestZones([]);
    }
  };

  const handlePlacemarkClick = async (zone) => {
    try {
      const response = await fetch(`http://localhost:8080/parking-zones/get/${zone.id}/partial`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSelectedZone(data);
    } catch (error) {
      console.warn(`Ошибка загрузки зоны ${zone.id}, fallback на зону с карты`);
      setSelectedZone(zone);
    }
  };

  const handleMoreDetails = () => {
    if (selectedZone) {
      const path = user === 'CLIENT' ? `/client/parking/${selectedZone.id}` : `/owner/parking/${selectedZone.id}`;
      navigate(path);
    }
  };

  // Изменённая функция handleSelect теперь принимает coords и адрес, чтобы сохранить адрес в поле
  const handleSelect = (coords, address) => {
    if (mapRef.current) {
      mapRef.current.setCenter(coords, 13);
    }
    setSearchPlacemarkCoords(coords);
    setResults([]);
    setQuery(address); // Оставляем выбранный адрес в поле
  };

  const renderStars = (rating) => {
    if (isNaN(rating) || rating < 0 || rating > 5) {
      return <span>Нет рейтинга</span>;
    }

    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {[...Array(full)].map((_, i) => <span key={`f-${i}`} className="star full">&#9733;</span>)}
        {half && <span className="star half">&#9733;</span>}
        {[...Array(empty)].map((_, i) => <span key={`e-${i}`} className="star empty">&#9734;</span>)}
      </>
    );
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  };

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text) return setResults([]);

    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=79c4dca7-80ed-4233-b785-8cce6955f1b4&format=json&geocode=${encodeURIComponent(text)}&results=15`
      );
      const data = await response.json();
      const found = data.response.GeoObjectCollection.featureMember;
      setResults(found);
    } catch (e) {
      console.warn('Ошибка поиска по адресу:', e);
    }
  };

  return (
    <div className="mapPageContainer">
      <YMaps>
        <div style={{ position: 'relative', height: '100%' }}>
          <div style={{ position: 'absolute', top: 150, left: 10, zIndex: 1000, width: 300 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Введите адрес"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => {
                  if (searchPlacemarkCoords) {
                    findNearestZones(searchPlacemarkCoords);
                    if (mapRef.current) {
                      mapRef.current.setCenter(searchPlacemarkCoords, 14);
                    }
                  } else {
                    alert('Сначала выберите точку на карте или в поиске');
                  }
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#f5c518',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                Найти 3 ближайшие
              </button>
            </div>
            {results.length > 0 && (
              <ul style={{
                backgroundColor: 'white',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                border: '1px solid #ccc',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {results.map((item, idx) => {
                  const name = item.GeoObject.name;
                  const coords = item.GeoObject.Point.pos.split(' ').map(Number).reverse();

                  // Пытаемся найти компонент с типом locality (город)
                  const addressComponents = item.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components;
                  const cityComponent = addressComponents.find(c => c.kind === 'locality');
                  const cityName = cityComponent ? cityComponent.name : '';

                  return (
                    <li
                      key={idx}
                      onClick={() => handleSelect(coords, name)}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      {name} {cityName && `, ${cityName}`}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Map
            defaultState={{ center: [51.533562, 46.034257], zoom: 13 }}
            width="100%"
            height="100%"
            instanceRef={mapRef}
          >
            {parkingZones.map((zone) => (
              <Placemark
                key={zone.id}
                geometry={[zone.latitude, zone.longitude]}
                properties={{
                  iconContent: `${zone.parkingSpacesCount} мест`,
                }}
                options={{
                  preset: 'islands#blueCircleIconWithCaption',
                  cursor: 'pointer',
                }}
                onClick={() => handlePlacemarkClick(zone)}
              />
            ))}
            {searchPlacemarkCoords && (
              <Placemark
                geometry={searchPlacemarkCoords}
                options={{
                  preset: 'islands#redDotIcon',
                  draggable: false,
                }}
              />
            )}
            {nearestZones.map((zone) => (
              <Placemark
                key={`nearest-${zone.id}`}
                geometry={[zone.latitude, zone.longitude]}
                properties={{
                  iconContent: `${zone.parkingSpacesCount} мест`,
                }}
                options={{
                  preset: 'islands#redCircleIconWithCaption', // или 'islands#blueCircleIconWithCaption'
                  cursor: 'pointer',
                  iconColor: '#FFD700',
                }}
                onClick={() => handlePlacemarkClick(zone)}
              />
            ))}
          </Map>
        </div>
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
            {selectedZone.rev.length > 0 && (
              <>
                <div className="ratingContainer">
                  <div className="stars">{renderStars(calculateAverageRating(selectedZone.rev))}</div>
                  <div className="ratingNumber">{calculateAverageRating(selectedZone.rev).toFixed(1)}</div>
                </div>

                <div className="reviewContainer">
                  <p className="reviewUser">
                    {selectedZone.rev[selectedZone.rev.length - 1].client?.email || 'Неизвестный пользователь'}
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
              </>
            )}
            <button className="allReviewsButton">Смотреть все отзывы</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserParkingMapPage;
