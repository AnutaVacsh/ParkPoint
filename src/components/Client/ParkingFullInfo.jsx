import React, { useState } from "react";
import { FaMap, FaArrowRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/parkingFullInfo.css";

// Локальные картинки
import img1 from "../../img/car0.png";
import img2 from "../../img/car1.png";
import img3 from "../../img/car2.png";

const ParkingFullInfo = () => {
  // Моковые данные
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

  const [current, setCurrent] = useState(0);
  const photos = mockParkingData.photos;
  const navigate = useNavigate();
  const location = useLocation();

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

      {/* Кнопка карты (бумажная карта) */}
      <button className="map-button" onClick={handleMapClick}>
        <FaMap />
      </button>

      {/* Стрелки */}
      <button className="arrow left" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="arrow right" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Нижний оверлей с инфо */}
      <div className="info-overlay">
        <div className="info-column">
          <h1>{mockParkingData.title}</h1>
          <p><strong>Адрес:</strong> {mockParkingData.address}</p>
          <p><strong>Описание:</strong> {mockParkingData.description}</p>
          <p><strong>Всего мест:</strong> {mockParkingData.parkingSpacesCount}</p>
          <p><strong>Состояние:</strong> {mockParkingData.state}</p>
        </div>
        <button className="book-button" onClick={handleBookingClick}>
          Забронировать
        </button>
      </div>
    </div>
  );
};

export default ParkingFullInfo;
