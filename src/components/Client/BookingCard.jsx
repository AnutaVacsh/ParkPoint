import React, { useEffect, useState } from 'react';
import '../../css/bookingCardStyle.css';
import { Link, useNavigate } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState(null);
  const [emailLoading, setEmailLoading] = useState(true);
  const [emailError, setEmailError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  const { id, price, startTime, endTime, status, parkingSpace } = booking;
  const { parkingZoneDto, order, idOwner } = parkingSpace;
  const { title, address } = parkingZoneDto;

  useEffect(() => {
    if (!idOwner) return;
    fetch(`http://localhost:8080/user/info/${idOwner}`)
      .then(res => res.json())
      .then(data => {
        setOwnerEmail(data.email || null);
        setEmailLoading(false);
      })
      .catch(() => {
        setEmailError('Не удалось загрузить email владельца');
        setEmailLoading(false);
      });
  }, [idOwner]);

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

  const translateStatus = (status) => {
    const map = {
      PENDING: 'Ожидают подтверждения',
      CONFIRMED: 'Подтверждено',
      REJECTED: 'Отклонено',
      CANCELLED: 'Отменено',
      COMPLETED: 'Завершено',
      EXPIRED: 'Прошедшая',
      SUBSCRIPTION: 'Подписка'
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FEE174';
      case 'CONFIRMED': return '#9DFE74';
      case 'REJECTED': return '#FE7974';
      case 'CANCELLED':
      case 'COMPLETED':
      case 'EXPIRED': return '#A8A8A8';
      case 'SUBSCRIPTION': return '#FF9000';
      default: return '#FFFFFF';
    }
  };

  const handleCancel = async () => {
    const now = new Date();
    const start = new Date(startTime);
    const hoursDiff = (start - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      setShowWarning(true);
    } else {
      await confirmCancel();
    }
  };

  const confirmCancel = async () => {
  try {
    const res = await fetch(`http://localhost:8080/booking/change/state/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify('CANCELLED')
    });

    if (!res.ok) throw new Error('Ошибка при отмене');

    setShowWarning(false);
    setIsModalOpen(false);
    setShowSuccessModal(true);
  } catch (error) {
    setShowWarning(false);
    setIsModalOpen(false);
    setShowErrorModal(true);
  }
};

  const handleCardClick = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setShowWarning(false);
  };

  const handleComplain = () => {
    navigate(`/create/complain/${booking.client.id}/${id}`);
  };

  const handleReview = () => {
    console.log('Оставить отзыв', id);
  };

  const borderColor = getStatusColor(status);

  return (
    <>
      <div className="bookingCard" style={{ borderColor }} onClick={handleCardClick}>
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
          <p><strong>Место №:</strong> {order}</p>
          <p><strong>Стоимость:</strong> {price / 100} ₽</p>
          <div className='inLine'>
            <span>Статус:</span>
            <span className="status" style={{ color: borderColor }}>{translateStatus(status)}</span>
          </div>
        </div>
      </div>

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
              </div>
              <div className="modalSection">
                <h4>Место</h4>
                <p><strong>Адрес:</strong> {address}</p>
                <p><strong>Зона:</strong> {title}</p>
                <p><strong>№:</strong> {order}</p>
                {ownerEmail && <p><strong>Владелец:</strong> <Link to={`/user/dashboard/${idOwner}`} className="ownerLink">{ownerEmail}</Link></p>}
              </div>
              <div className="modalSection">
                <h4>Оплата</h4>
                <p><strong>Сумма:</strong> {price / 100} ₽</p>
                <p><strong>Статус:</strong> <span style={{ color: borderColor }}>{translateStatus(status)}</span></p>
              </div>
            </div>

            <div className="modalActions">
              {(status === 'CONFIRMED' || status === 'PENDING') && (
                <button className="actionButton cancelButton" onClick={handleCancel}>
                  Отменить
                </button>
              )}
              {status === 'COMPLETED' && (
                <button className="actionButton reviewButton" onClick={handleReview}>Оставить отзыв</button>
              )}
              {['CONFIRMED', 'COMPLETED', 'SUBSCRIPTION'].includes(status) && (
                <button className="actionButton complainButton" onClick={handleComplain}>Пожаловаться</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showWarning && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent warning" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseButton" onClick={closeModal}>×</button>
            <h3>Предупреждение</h3>
            <p>Вы отменяете бронирование менее чем за сутки. Средства не будут возвращены.</p>
            <div className="modalActions">
              <button className="actionButton cancelButton" onClick={confirmCancel}>Отменить бронирование</button>
              <button className="actionButton" onClick={closeModal}>Назад</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modalOverlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseButton" onClick={() => setShowSuccessModal(false)}>×</button>
            <h3>Успешно</h3>
            <p>Бронирование отменено.</p>
            <div className="modalActions">
              <button className="actionButton" onClick={() => setShowSuccessModal(false)}>ОК</button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="modalOverlay" onClick={() => setShowErrorModal(false)}>
          <div className="modalContent warning" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseButton" onClick={() => setShowErrorModal(false)}>×</button>
            <h3>Ошибка</h3>
            <p>Не удалось отменить бронирование. Попробуйте позже.</p>
            <div className="modalActions">
              <button className="actionButton" onClick={() => setShowErrorModal(false)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;
