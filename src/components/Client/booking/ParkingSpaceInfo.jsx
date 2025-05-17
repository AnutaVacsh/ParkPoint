import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ParkingSpaceInfo({ space }) {
  const [ownerEmail, setOwnerEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!space || !space.idOwner) {
      setOwnerEmail(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/user/info/${space.idOwner}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных владельца');
        return res.json();
      })
      .then((data) => {
        setOwnerEmail(data.email || null);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [space]);

  if (!space) return <div>Выберите парковочное место для просмотра информации</div>;

  const {
    order,
    description,
    hourlyPrice,
    dailyPrice,
    weeklyPrice,
    monthlyPrice,
    idOwner,
    parkingZoneDto,
  } = space;

  const { address } = parkingZoneDto || {};

  return (
    <div className="parking-space-info">
      <h3>Парковочное место №{order}</h3>
      <p><strong>Адрес:</strong> {address || 'Не указан'}</p>
      <p><strong>Описание:</strong> {description || 'Нет описания'}</p>

      <p><strong>Цена за час:</strong> {hourlyPrice ? `${hourlyPrice / 100} ₽` : 'Не указано'}</p>
      <p><strong>Цена за день:</strong> {dailyPrice ? `${dailyPrice / 100} ₽` : 'Не указано'}</p>
      <p><strong>Цена за неделю:</strong> {weeklyPrice ? `${weeklyPrice / 100} ₽` : 'Не указано'}</p>
      <p><strong>Цена за месяц:</strong> {monthlyPrice ? `${monthlyPrice / 100} ₽` : 'Не указано'}</p>

      <p>
        <strong>Владелец:</strong>{' '}
        {loading ? (
          'Загрузка...'
        ) : error ? (
          <span className="error-text">Ошибка загрузки</span>
        ) : ownerEmail ? (
          <Link to={`/user/dashboard/${idOwner}`} className="owner-link">{ownerEmail}</Link>
        ) : (
          <Link to={`/user/dashboard/${idOwner}`} className="owner-link">Профиль владельца</Link>
        )}
      </p>
    </div>
  );
}

export default ParkingSpaceInfo;

/* Добавленные стили */
const styles = `
.parking-space-info {
  max-width: 400px;
  background: #1D2329;
  border: 1px solid #2E3A45;
  padding: 20px;
  border-radius: 8px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #E0E6ED;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

.parking-space-info h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 700;
  color: #F0F4F8;
  border-bottom: 2px solid #2E3A45;
  padding-bottom: 6px;
}

.parking-space-info p {
  margin: 8px 0;
  line-height: 1.4;
  font-size: 14px;
}

.parking-space-info strong {
  color: #AAB8C2;
}

.parking-space-info .owner-link {
  color: #72A8FF;
  font-weight: 600;
  text-decoration: none;
}

.parking-space-info .owner-link:hover {
  text-decoration: underline;
}

.parking-space-info .error-text {
  color: #FF6B6B;
  font-weight: 600;
}

/* Стили для модального контейнера */
.modal-container {
  background: #1D2329;
  border-radius: 10px;
  padding: 24px 32px;
  max-width: 500px;
  margin: 40px auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
  color: #E0E6ED;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.modal-container h2, 
.modal-container h3 {
  color: #F0F4F8;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 700;
}

.modal-container p {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 14px;
  color: #FFFFFF;
}

.modal-container a {
  color: #72A8FF;
  text-decoration: none;
  font-weight: 600;
}

.modal-container a:hover {
  text-decoration: underline;
}
`;

// Автоматическая вставка стилей в head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
