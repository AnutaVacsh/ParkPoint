import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/bookingConfirmation.css';
import { mockZoneData } from '../../../dto/mock/MockZoneData';

const WEEK_DAYS_RU = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

export default function SubscriptionConfirmation() {
  const { id, subscriptionParams } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Парсим параметры подписки
  useEffect(() => {
    if (subscriptionParams) {
      const params = new URLSearchParams(decodeURIComponent(subscriptionParams));
      const subData = {
        parkingSpaceId: Number(params.get('parkingSpaceId')),
        clientId: Number(params.get('clientId')),
        dayOfWeak: params.get('dayOfWeak')?.split(',').map(Number) || [],
        startTime: params.get('startTime'),
        endTime: params.get('endTime')
      };
      setSubscription(subData);
    }
  }, [subscriptionParams]);

  // Загрузка данных о зоне
  useEffect(() => {
    fetch(`http://localhost:8080/parking-zones/get/${id}/partial`)
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setZone(data);
      })
      .catch(err => {
        setZone(mockZoneData);
      });
  }, [id]);

  // Отправка подписки на сервер
  useEffect(() => {
    if (!subscription || !zone) return;

    const createSubscription = async () => {
      try {
        const response = await fetch('http://localhost:8080/subscription/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parkingSpaceId: subscription.parkingSpaceId,
            clientId: subscription.clientId,
            dayOfWeak: subscription.dayOfWeak,
            startTime: subscription.startTime,
            endTime: subscription.endTime
          })
        });

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Подписка создана:', data);
      } catch (err) {
        console.error('Ошибка при создании подписки:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    createSubscription();
  }, [subscription, zone]);

  if (!zone || !subscription || isLoading) {
    return <div className="bc-container"><p className="loading">Загрузка...</p></div>;
  }

//   if (error) {
//     return (
//       <div className="bc-container">
//         <div className="bc-overlay" />
//         <main className="bc-main">
//           <h1 className="bc-title">Ошибка</h1>
//           <p className="error-message">{error}</p>
//           <button
//             className="bc-button"
//             onClick={() => navigate('/client')}
//           >
//             На главную
//           </button>
//         </main>
//       </div>
//     );
//   }

  const formattedDays = subscription.dayOfWeak
    .map(day => WEEK_DAYS_RU[day])
    .join(', ');

  return (
    <div className="bc-container">
      <div className="bc-overlay" />

      <main className="bc-main">
        <h1 className="bc-title">Подписка оформлена</h1>

        <div className="bc-card">
          <div className="bc-address">
            г. {zone.address}<br/>
            Парковка «{zone.title}»<br/>
            Место {subscription.parkingSpaceId}
          </div>

          <div className="bc-times">
            <div className="bc-time-block">
              <span className="label">Начало</span>
              <span className="time">{formatTime(subscription.startTime)}</span>
            </div>
            <div className="bc-separator">››</div>
            <div className="bc-time-block">
              <span className="label">Конец</span>
              <span className="time">{formatTime(subscription.endTime)}</span>
            </div>
          </div>

          <div className="bc-days">
            <span className="label">Дни недели:</span>
            <span className="days">{formattedDays}</span>
          </div>
        </div>

        {error && 
            <p className="error-message">Ошибка при сохранении подписки, попробуйте позже</p>
        }

        <button
          className="bc-button"
          onClick={() => navigate('/client')}
        >
          На главную
        </button>
      </main>
    </div>
  );
}