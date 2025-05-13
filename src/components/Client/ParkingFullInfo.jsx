import React, { useContext, useEffect, useState } from "react";
import { FaMap } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../css/parkingFullInfo.css";

// Локальные картинки-заглушки
import img1 from "../../img/car0.png";
import img2 from "../../img/car1.png";
import img3 from "../../img/car2.png";
import { UserContext } from "../../contexts/UserContext";

const mockParkingData = {
  id: 1,
  title: "Парковка на проспекте Кирова",
  address: "Проспект Кирова, Саратов",
  description: "Очень удобная парковка в центре города. Всегда есть свободные места.",
  parkingSpacesCount: 20,
  state: "Открыта",
  photos: [
    { id: 1, url: img1 },
    { id: 2, url: img2 },
    { id: 3, url: img3 },
  ],
};

const ParkingFullInfo = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [parkingData, setParkingData] = useState(null);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/parking-zones/get/${id}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setParkingData(data);
        console.log(data);
      } catch (error) {
        console.warn("Ошибка загрузки парковки, используем моки");
        setParkingData(mockParkingData);
      }
    };
    fetchParkingData();
  }, [id]);

  if (!parkingData) return <div>Загрузка...</div>;

  // Если нет фото — отображаем одну заглушку
  const photos =
    parkingData.photos && parkingData.photos.length > 0
      ? parkingData.photos
      : [{ url: img2 }];

  const prevSlide = () =>
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const nextSlide = () =>
    setCurrent((c) => (c + 1) % photos.length);

  const handleMapClick = () => {
    console.log("Map button clicked");
  };

  const handleBookingClick = () => {
    navigate(`${location.pathname}/booking`);
  };

  return (
    <div className="parking-full-info">
      {/* Слайдер-фон */}
      <div
        className="slide"
        style={{ backgroundImage: `url(${photos[current].url})` }}
      />

      {/* Кнопка карты */}
      <button className="map-button" onClick={handleMapClick}>
        <FaMap />
      </button>

      {/* Стрелки */}
      {photos.length > 1 && (
        <>
          <button className="arrow left" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="arrow right" onClick={nextSlide}>
            &#10095;
          </button>
        </>
      )}

      {/* Нижний оверлей с инфо */}
      <div className="info-overlay">
        <div className="info-column">
          <h1>{parkingData.title}</h1>
          <p><strong>Адрес:</strong> {parkingData.address}</p>
          <p><strong>Описание:</strong> {parkingData.description}</p>
          <p><strong>Всего мест:</strong> {parkingData.parkingSpacesCount}</p>
          <p><strong>Состояние:</strong> {parkingData.state}</p>
        </div>
        {user === "CLIENT" && 
        <button className="book-button" onClick={handleBookingClick}>
        Забронировать
      </button>}
      </div>
    </div>
  );
};

export default ParkingFullInfo;
