import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/subscription.css';

const Subscription = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showNewCard, setShowNewCard] = useState(false);
  const [parkingInfo, setParkingInfo] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null); // Добавим состояние для ошибок формы

  const navigate = useNavigate();
  const { id, spaceId, startDate, endDate } = useParams();
  const userId = localStorage.getItem('userId');

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().slice(11, 16);
  };

  const [startTime, setStartTime] = useState(formatTime(startDate));
  const [endTime, setEndTime] = useState(formatTime(endDate));

  const mockPaymentMethods = [
    { last4: '1234' },
    { last4: '5678' },
  ];

  const mockParkingInfo = {
    id: 1,
    idOwner: 123,
    order: 1,
    hourlyPrice: 100,
    dailyPrice: 500,
    weeklyPrice: 2000,
    monthlyPrice: 8000,
    isAvailable: 'AVAILABLE',
    description: 'Парковка в центре города',
    parkingZoneDto: {
      id: 1,
      zoneManager: 456,
      title: 'Центральная парковка',
      address: 'ул. Ленина, 10',
      description: 'Парковка рядом с офисом',
      map: 'some-map-url',
      state: 'ACTIVE',
      parkingSpacesCount: 50,
      latitude: 55.7558,
      longitude: 37.6173,
      photos: [
        { url: 'https://example.com/photo1.jpg' },
        { url: 'https://example.com/photo2.jpg' },
      ],
    },
  };

  useEffect(() => {
    const fetchParkingInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/parking-spaces/get/${spaceId}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке информации о парковке');
        }
        const data = await response.json();
        setParkingInfo(data);
      } catch (error) {
        console.error('Ошибка при получении информации о парковке:', error);
        setParkingInfo(mockParkingInfo); // Используем мок
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/get/cards/${userId}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке карт');
        }
        const data = await response.json();
        setPaymentMethods(data);
      } catch (error) {
        console.error('Ошибка при получении карт:', error);
        setPaymentMethods(mockPaymentMethods); // Используем моки
      }
    };

    if (userId && spaceId) {
      fetchParkingInfo();
      fetchPaymentMethods();
    } else {
      setError('Не найден userId или spaceId');
    }

    setLoading(false);
  }, [userId, spaceId]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const daysOfWeek = [
    { id: 1, label: 'пн' },
    { id: 2, label: 'вт' },
    { id: 3, label: 'ср' },
    { id: 4, label: 'чт' },
    { id: 5, label: 'пт' },
    { id: 6, label: 'сб' },
    { id: 7, label: 'вс' },
  ];

  const handleDaySelect = (dayId) => {
    setSelectedDays((prev) => {
      const updatedDays = prev.includes(dayId)
        ? prev.filter((d) => d !== dayId)
        : [...prev, dayId];
      return updatedDays;
    });
  };

  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId);
    setShowNewCard(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем, что время, дни недели и карта выбраны
    if (!startTime || !endTime) {
      setFormError('Пожалуйста, выберите время для бронирования.');
      return;
    }

    if (selectedDays.length === 0) {
      setFormError('Пожалуйста, выберите хотя бы один день недели.');
      return;
    }

    if (!selectedCard && !showNewCard) {
      setFormError('Пожалуйста, выберите способ оплаты.');
      return;
    }

    setFormError(null); // Сбрасываем ошибку, если все поля выбраны

    // Формируем объект Subscription
  const subscription = {
    parkingSpaceId: parkingInfo.id,
    clientId: userId,
    dayOfWeak: selectedDays, // Выбранные дни недели
    startTime: startTime,
    endTime: endTime
  };

  // Сериализуем объект в параметры URL
  const subscriptionParams = new URLSearchParams(subscription).toString();

    const selectedStartDate = new Date(startDate).toISOString();
    const selectedEndDate = new Date(endDate).toISOString();

    if (showNewCard) {
      navigate(`/client/parking/${id}/booking/subscription/pay/${subscriptionParams}`);
    } else {
      navigate(`/client/parking/${id}/booking/subscription/confirmation/${subscriptionParams}`);
    }
  };

  return (
    <div className="subscription-container">
      <h1>Оформление подписки</h1>

      <div className="parking-info">
        <p>{parkingInfo?.parkingZoneDto.address}</p>
        <p>Парковка {parkingInfo?.parkingZoneDto.title}</p>
        <p>Место {parkingInfo?.order}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="time-section">
          <h2>В какое время</h2>
          <div className="time-inputs">
            <div>
              <label>Начало</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label>Выезд</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="days-section">
          <h2>В какие дни недели</h2>
          <div className="days-grid">
            {daysOfWeek.map((day) => (
              <button
                key={day.id}
                type="button"
                className={`day-button ${selectedDays.includes(day.id) ? 'selected' : ''}`}
                onClick={() => handleDaySelect(day.id)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="payment-section">
          <h2>Способ оплаты</h2>
          {paymentMethods.map((card) => (
            <div key={card.last4} className="card-option">
              <input
                type="radio"
                id={card.last4}
                name="paymentCard"
                checked={selectedCard === card.last4}
                onChange={() => handleCardSelect(card.last4)}
              />
              <label htmlFor={card.last4}>**** **** **** {card.last4}</label>
            </div>
          ))}

          <div className="new-card-option">
            <input
              type="radio"
              id="newCard"
              name="paymentCard"
              checked={showNewCard}
              onChange={() => {
                setSelectedCard(null);
                setShowNewCard(true);
              }}
            />
            <label htmlFor="newCard">Новая карта</label>
          </div>
        </div>

        {formError && <div className="error-message">{formError}</div>} {/* Отображаем ошибку */}

        <button type="submit" className="continue-button">
          Продолжить
        </button>
      </form>
    </div>
  );
};

export default Subscription;
