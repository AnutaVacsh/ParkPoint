// BookingConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/bookingConfirmation.css';
import { mockZoneData } from '../../../dto/mock/MockZoneData';  // импортируем моковые данные

const WEEK_DAYS_RU = ['вс','пн','вт','ср','чт','пт','сб'];
const MONTH_NAMES_RU = [
  'января','февраля','марта','апреля','мая','июня',
  'июля','августа','сентября','октября','ноября','декабря'
];

function formatDateLocal(iso) {
  const d = new Date(decodeURIComponent(iso));
  const dayName = WEEK_DAYS_RU[d.getDay()];
  const day = d.getDate();
  const month = MONTH_NAMES_RU[d.getMonth()];
  return `${dayName}, ${day} ${month}`;
}

function formatTimeLocal(iso) {
  const d = new Date(decodeURIComponent(iso));
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

export default function BookingConfirmation() {
  const { id, spaceId, startDate, endDate } = useParams();
  const navigate = useNavigate();

  const [zone, setZone] = useState(null);

  // 1. Загрузка данных о зоне
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
        // console.error(err);
        // setError('Не удалось загрузить данные о зоне');
        setZone(mockZoneData);
      });
  }, [id]);

  // 2. Пока ждём данные
  if (!zone) {
    return <div className="bc-container"><p className="loading">Загрузка...</p></div>;
  }

  return (
    <div className="bc-container">
      <div className="bc-overlay" />

      <main className="bc-main">
        <h1 className="bc-title">Ваша заявка отправлена</h1>

        <div className="bc-card">
          <div className="bc-address">
            г. {zone.address}<br/>
            Парковка «{zone.title}»<br/>
            Место {spaceId}
          </div>

          <div className="bc-times">
            <div className="bc-time-block">
              <span className="label">Начало</span>
              <span className="date">{formatDateLocal(startDate)}</span>
              <span className="time">{formatTimeLocal(startDate)}</span>
            </div>
            <div className="bc-separator">››</div>
            <div className="bc-time-block">
              <span className="label">Выезд</span>
              <span className="date">{formatDateLocal(endDate)}</span>
              <span className="time">{formatTimeLocal(endDate)}</span>
            </div>
          </div>
        </div>

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
