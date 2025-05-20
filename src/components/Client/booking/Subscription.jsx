import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/subscription.css';

const Subscription = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showNewCard, setShowNewCard] = useState(false);
  const [parkingInfo, setParkingInfo] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const navigate = useNavigate();
  const { id, spaceId, startDate, endDate } = useParams();
  const userId = localStorage.getItem('userId');

  const formatTime = (isoDate) => {
    if (!isoDate) return '';
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
        setParkingInfo(mockParkingInfo);
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
        setPaymentMethods(mockPaymentMethods);
      }
    };

    if (userId && spaceId) {
      Promise.all([fetchParkingInfo(), fetchPaymentMethods()]).then(() => setLoading(false));
    } else {
      setError('Не найден userId или spaceId');
      setLoading(false);
    }
  }, [userId, spaceId]);

  // Загрузка занятых слотов для выбранного пространства и периода (месяц)
  // useEffect(() => {
  //   if (!spaceId || !startDate) return;

  //   const fetchOccupiedSlots = async () => {
  //     try {
  //       const startDateStr = startDate.slice(0, 10);
  //       const endDateObj = new Date(startDate);
  //       endDateObj.setMonth(endDateObj.getMonth() + 1);
  //       const endDateStr = endDateObj.toISOString().slice(0, 10);

  //       const response = await fetch(
  //         `http://localhost:8080/booking/occupiedSlots?spaceId=${spaceId}&startDate=${startDateStr}&endDate=${endDateStr}`
  //       );
  //       if (!response.ok) throw new Error('Ошибка при загрузке занятых слотов');

  //       const data = await response.json();
  //       setOccupiedSlots(data);
  //     } catch (err) {
  //       console.error(err);
  //       setOccupiedSlots([]); // Можно обработать ошибку по-другому
  //     }
  //   };

  //   fetchOccupiedSlots();
  // }, [spaceId, startDate]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

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
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId);
    setShowNewCard(false);
  };

  const isTimeOverlap = (startA, endA, startB, endB) => {
    return startA < endB && startB < endA;
  };

  const checkSlotsFree = () => {
    for (const selectedDay of selectedDays) {
      for (const slot of occupiedSlots) {
        if (slot.dayOfWeek === selectedDay) {
          if (isTimeOverlap(startTime, endTime, slot.startTime, slot.endTime)) {
            return false; // пересечение найдено
          }
        }
      }
    }
    return true; // пересечений нет
  };
  
    console.log(parkingInfo)

  const checkAvailability = async () => {
    try {
      setIsCheckingAvailability(true);
      
      // Преобразуем время из формата "HH:mm" в объект времени
      const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return {
          hour: hours,
          minute: minutes,
          second: 0,
          nano: 0
        };
      };

      const requestBody = {
        parkingSpaceId: parkingInfo.id,
        dayOfWeak: selectedDays,
        startTime: startTime + ':00',
        endTime: endTime + ':00'
      };

      const response = await fetch('http://localhost:8080/subscription/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json(); // Ожидаем boolean ответ
    } catch (error) {
      console.error('Ошибка при проверке доступности:', error);
      setFormError('Ошибка при проверке доступности. Попробуйте позже.');
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация формы
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

    // Проверка локальных пересечений
    if (!checkSlotsFree()) {
      setFormError('Выбранные дни и время пересекаются с уже занятыми слотами.');
      return;
    }

    // Проверка доступности через API
    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      setFormError('Выбранное время уже занято. Пожалуйста, выберите другое время.');
      return;
    }

    setFormError(null);
    console.log(parkingInfo)

    // Подготовка данных для подписки
      // Формируем объект Subscription
  const subscription = {
    parkingSpaceId: parkingInfo.id,
    clientId: userId,
    dayOfWeak: selectedDays, // Выбранные дни недели
    startTime: startTime,
    endTime: endTime,
    price: parkingInfo.dailyPrice,
    createTime: new Date().toISOString()
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

        {formError && <div className="error-message">{formError}</div>}

        <button type="submit" className="continue-button">
          Продолжить
        </button>
      </form>
    </div>
  );
};

export default Subscription;
