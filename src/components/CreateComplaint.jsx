import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/createComplaint.css'; // Импортируем CSS файл

const CreateComplaint = () => {
  const { userId, bookingId } = useParams(); // Получаем id пользователя и бронирования из URL
  const [booking, setBooking] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Функция для получения данных о бронировании
  const fetchBooking = async () => {
    try {
      const response = await fetch(`http://localhost:8080/booking/get/${bookingId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные о бронировании');
      }
      const data = await response.json();
      setBooking(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]); // Зависимость от bookingId

  // Функция для получения цвета текста статуса
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FEE174'; // Ожидают подтверждения
      case 'CONFIRMED': return '#9DFE74'; // Подтверждено
      case 'REJECTED': return '#FE7974'; // Отклонено
      case 'CANCELLED':
      case 'COMPLETED':
      case 'EXPIRED': return '#A8A8A8'; // Завершено / Отменено / Прошедшее
      case 'SUBSCRIPTION': return '#FF9000'; // Подписка
      default: return '#FFFFFF'; // По умолчанию белый
    }
  };

  // Функция для получения текста статуса
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Ожидают подтверждения';
      case 'CONFIRMED': return 'Подтверждено';
      case 'REJECTED': return 'Отклонено';
      case 'CANCELLED': return 'Отменено';
      case 'COMPLETED': return 'Завершено';
      case 'EXPIRED': return 'Прошедшая';
      case 'SUBSCRIPTION': return 'Подписка';
      default: return 'Неизвестный статус';
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    if (!complaintText.trim()) {
        alert('Пожалуйста, укажите текст жалобы');
        return;
    }

    const complainantId = Number(localStorage.getItem('userId'));
    const role = localStorage.getItem('role');

    if (!complainantId || !role) {
        alert('Не удалось определить пользователя или его роль');
        return;
    }

    let accusedId;

    if (role === 'CLIENT') {
        accusedId = booking.parkingSpace.idOwner;
    } else if (role === 'OWNER') {
        accusedId = booking.client.id;
    } else {
        alert('Недопустимая роль пользователя');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/complaint/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            complainantId,
            accusedId,
            text: complaintText,
        }),
        });

        if (!response.ok) {
        throw new Error('Не удалось отправить жалобу');
        }

        await response.json(); // если нужно использовать, можно сохранить в result
        navigate(-1);
        
    } catch (err) {
        console.error(err);
        alert('Произошла ошибка при отправке жалобы');
    }
    };



  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="create-complaint-page">
      <div className="complaint-container">
        <div className="booking-info">
          <h3>Информация о бронировании</h3>
          {booking && (
            <div className="booking-details">
              <p><strong>Статус: </strong> 
                <span className="status-text" style={{ color: getStatusColor(booking.status) }}>
                   {getStatusText(booking.status)}
                </span>
              </p>
                <p><strong>Клиент:</strong> {booking.client.email} (ID: {booking.client.id})</p>
                <p><strong>Парковка:</strong> {booking.parkingSpace.parkingZoneDto.title}</p>
                <p><strong>Адрес парковки:</strong> {booking.parkingSpace.parkingZoneDto.address}</p>
                <p><strong>Место:</strong> {booking.parkingSpace.order}</p>
                <p><strong>Дата начала:</strong> {new Date(booking.startTime).toLocaleDateString('ru-RU', {
                year: 'numeric', month: 'long', day: 'numeric'
                })} в {new Date(booking.startTime).toLocaleTimeString('ru-RU', {
                hour: '2-digit', minute: '2-digit'
                })}</p>
                <p><strong>Дата окончания:</strong> {new Date(booking.endTime).toLocaleDateString('ru-RU', {
                year: 'numeric', month: 'long', day: 'numeric'
                })} в {new Date(booking.endTime).toLocaleTimeString('ru-RU', {
                hour: '2-digit', minute: '2-digit'
                })}</p>
                <p><strong>Цена:</strong> {booking.price/100} руб.</p>
            </div>
          )}
        </div>

        <div className="complaint-form">
          <h3>Оставить жалобу</h3>
          <form onSubmit={handleSubmitComplaint}>
            <div className="form-group">
              <textarea
                id="complaintText"
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                rows="7" // Увеличено количество строк
                required
                placeholder="Введите вашу жалобу..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">Отправить жалобу</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
