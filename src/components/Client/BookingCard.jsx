import React, { useEffect, useState } from 'react';
import '../../css/bookingCardStyle.css';
import { Link, useNavigate } from 'react-router-dom';
import { changeStateBooking } from '../../api/BookingApi';

const BookingCard = ({ booking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 
  const [ownerEmail, setOwnerEmail] = useState(null);
  const [emailLoading, setEmailLoading] = useState(true);
  const [emailError, setEmailError] = useState(null);
  
  
  const { id, price, startTime, endTime, status, parkingSpace } = booking;
  const { parkingZoneDto, order, idOwner } = parkingSpace;
  const { title, address } = parkingZoneDto;

  // Функция для перевода статусов
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

  useEffect(() => {
    if (!idOwner) return;

    fetch(`http://localhost:8080/user/info/${idOwner}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных владельца');
        return res.json();
      })
      .then((data) => {
        setOwnerEmail(data.email || null);
        setEmailLoading(false);
      })
      .catch((e) => {
        setEmailError(e.message);
        setEmailLoading(false);
      });
  }, [idOwner]);

  const handleCancel = async (e) => {
    e.stopPropagation();
    
    try {
      const isConfirmed = window.confirm('Вы уверены, что хотите отменить бронирование?');
      if (!isConfirmed) return;
  
      console.log('Начало отмены бронирования', id);
      
      const updatedBooking = await changeStateBooking(id, 'CANCELLED');
      
      console.log('Бронирование успешно отменено:', updatedBooking);
      
      setIsModalOpen(false);
      
      alert('Бронирование успешно отменено');
      
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
      alert(`Не удалось отменить бронирование: ${error.message}`);
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

  const borderColor = getStatusColor(status);

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

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="bookingCard" 
        style={{ borderColor }}
        onClick={handleCardClick}
      >
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
          <p><strong>Стоимость:</strong> {price/100} ₽</p>
          <div className='inLine'>
            <span>Статус:</span>
            <span className="status" style={{ color: borderColor }}> {translateStatus(status)}</span>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseButton" onClick={closeModal}>×</button>
            
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
                {idOwner && (
                  <p>
                    <strong>Владелец:</strong>{' '}
                    {emailLoading ? (
                      'Загрузка...'
                    ) : emailError ? (
                      <span style={{ color: 'red' }}>Ошибка: {emailError}</span>
                    ) : (
                      <Link
                        to={`/user/dashboard/${idOwner}`}
                        className="ownerLink"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {ownerEmail}
                      </Link>
                    )}

                  </p>
                )}
              </div>
              
              <div className="modalSection">
                <h4>Оплата</h4>
                <p><strong>Стоимость:</strong> {price/100} ₽</p>
                <p><strong>Статус:</strong> <span style={{ color: borderColor }}>{translateStatus(status)}</span></p>
              </div>
              {/* Кнопки действий */}
            <div className="modalActions">
              {status === 'PENDING' && (
                <button className="actionButton cancelButton" onClick={handleCancel}>
                  Отменить
                </button>
              )}
              
              {status === 'CONFIRMED' && (
                <>
                  <button className="actionButton cancelButton" onClick={handleCancel}>
                    Отменить
                  </button>
                  <button className="actionButton complainButton" onClick={handleComplain}>
                    Пожаловаться
                  </button>
                </>
              )}
              
              {status === 'COMPLETED' && (
                <>
                  <button className="actionButton reviewButton" onClick={handleReview}>
                    Оставить отзыв
                  </button>
                  <button className="actionButton complainButton" onClick={handleComplain}>
                    Пожаловаться
                  </button>
                </>
              )}
              
              {status === 'SUBSCRIPTION' && (
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
                </>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;