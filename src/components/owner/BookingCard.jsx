import React, { useState } from 'react';
import '../../css/bookingCardStyle.css';
import { Link, useNavigate } from 'react-router-dom';

const BookingCardOwner = ({ booking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(booking.status);

  const { id, price, startTime, endTime, parkingSpace } = booking;
  const { parkingZoneDto, order, idOwner } = parkingSpace;
  const { title, address } = parkingZoneDto;
  const navigate = useNavigate(); 

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING': return 'Ожидают подтверждения';
      case 'CONFIRMED': return 'Подтверждено';
      case 'REJECTED': return 'Отклонено';
      case 'CANCELLED': return 'Отменено';
      case 'COMPLETED': return 'Завершено';
      case 'EXPIRED': return 'Прошедшая';
      case 'SUBSCRIPTION': return 'Подписка';
      default: return status;
    }
  };

  const changeStateBooking = async (bookingId, stateBooking) => {
    const response = await fetch(`http://localhost:8080/booking/change/state/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stateBooking),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при изменении состояния бронирования');
    }
  
    return await response.json();
  };

  const updateBookingState = async (newState, confirmMessage) => {
    try {
      const isConfirmed = window.confirm(confirmMessage);
      if (!isConfirmed) return;

      const updated = await changeStateBooking(id, newState );
      setBookingStatus(updated.status);
      alert(`Бронирование ${translateStatus(updated.status).toLowerCase()}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Ошибка при смене статуса:`, error);
      alert(`Не удалось изменить статус: ${error.message}`);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    updateBookingState('CANCELLED', 'Вы уверены, что хотите отменить бронирование?');
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    updateBookingState('CONFIRMED', 'Подтвердить бронирование?');
  };

  const handleComplain = (e) => {
    e.stopPropagation();
    const userId = booking.client.id;
    const bookingId = booking.id;
    console.log('Жалоба на бронирование пользователя', userId);
    
    navigate(`/create/complain/${userId}/${bookingId}`);
  };

  const handleReview = (e) => {
    e.stopPropagation();
    console.log('Отзыв о бронировании', id);
  }; 

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FEE174';
      case 'CONFIRMED': return '#9DFE74';
      case 'REJECTED': return '#FE7974';
      case 'CANCELLED':
      case 'COMPLETED':
      case 'EXPIRED': return '#A8A8A8';
      case 'SUBSCRIPTION': return '#FF9000'
      default: return '#FFFFFF';
    }
  };

  const borderColor = getStatusColor(bookingStatus);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('ru-RU', { month: 'long' });
    const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    return (
      <>
        <span>{day} {month}</span>
        <br />
        <span>{time}</span>
      </>
    );
  };

  const isLessThan3Days = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffDays = (start - now) / (1000 * 60 * 60 * 24);
    return diffDays < 3;
  };

  const renderActions = () => {
    switch (bookingStatus) {
      case 'PENDING':
        return (
          <>
            <button className="actionButton cancelButton" onClick={handleCancel}>
              Отклонить
            </button>
            <button className="actionButton" onClick={handleConfirm}>
              Подтвердить
            </button>
          </>
        );

      case 'CONFIRMED':
        return (
          <>
            <button
              className="actionButton cancelButton"
              onClick={(e) => {
                if (isLessThan3Days(startTime)) {
                  alert('Нельзя отменить бронирование менее чем за 3 дня до начала.');
                } else {
                  handleCancel(e);
                }
              }}
            >
              Отменить
            </button>
            <button className="actionButton complainButton" onClick={handleComplain}>
              Пожаловаться
            </button>
          </>
        );

      case 'COMPLETED':
        return (
          <>
            <button className="actionButton reviewButton" onClick={handleReview}>
              Оставить отзыв
            </button>
            <button className="actionButton complainButton" onClick={handleComplain}>
              Пожаловаться
            </button>
          </>
        );

      case 'SUBSCRIPTION':
        return (
          <>
            <button className="actionButton cancelButton" onClick={handleCancel}>
              Отменить
            </button>
            <button className="actionButton reviewButton" onClick={handleReview}>
              Оставить отзыв
            </button>
            <button className="actionButton complainButton" onClick={handleComplain}>
              Пожаловаться
            </button>
            <p className="disclaimer">* Подписки можно отменить в течение 5 дней после начала.</p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="bookingCard" style={{ borderColor }} onClick={() => setIsModalOpen(true)}>
        <div className="bookingCardHeader">
          <div className="timeInfo">
            <span><strong>Начало</strong></span>
            <span>{formatDate(startTime)}</span>
          </div>
          <div className="timeInfo">
            <span><strong>Выезд</strong></span>
            <span>{formatDate(endTime)}</span>
          </div>
        </div>
        <div className="bookingCardContent">
          <p><strong>Адрес:</strong> {address}</p>
          <p><strong>Название:</strong> {title}</p>
          <p><strong>Номер места:</strong> {order}</p>
          <p><strong>Стоимость:</strong> {price / 100} ₽</p>
          <div className='inLine'>
            <span>Статус:</span>
            <span className="status" style={{ color: borderColor }}> {translateStatus(bookingStatus)}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseButton" onClick={() => setIsModalOpen(false)}>×</button>
            <h3>Детали бронирования</h3>

            <div className="modalGrid">
              <div className="modalSection">
                <h4>Время</h4>
                <p><strong>Начало:</strong> {formatDate(startTime)}</p>
                <p><strong>Окончание:</strong> {formatDate(endTime)}</p>
                <p><strong>Длительность:</strong> {Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60))} часов</p>
              </div>

              <div className="modalSection">
                <h4>Парковочное место</h4>
                <p><strong>Адрес:</strong> {address}</p>
                <p><strong>Зона:</strong> {title}</p>
                <p><strong>Место №:</strong> {order}</p>
                {booking.client && (
                  <p>
                    <strong>Клиент:</strong>
                    <Link to={`/user/dashboard/${booking.client.id}`} className="ownerLink" onClick={(e) => e.stopPropagation()}>
                      {booking.client.email}
                    </Link>
                  </p>
                )}
              </div>

              <div className="modalSection">
                <h4>Оплата</h4>
                <p><strong>Стоимость:</strong> {price / 100} ₽</p>
                <p><strong>Статус:</strong> <span style={{ color: borderColor }}>{translateStatus(bookingStatus)}</span></p>
              </div>

              <div className="modalActions">
                {renderActions()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCardOwner;
