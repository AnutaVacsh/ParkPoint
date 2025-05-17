import React, { useState } from 'react';
// import '../../css/bookingCardStyle.css';
import { Link, useNavigate } from 'react-router-dom';

const SubscriptionCard = ({ subscription }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    parkingSpace,
    client,
    dayOfWeak,
    startTime,
    endTime,
    price,
    createTime
  } = subscription;

  const { parkingZoneDto, order, idOwner } = parkingSpace;
  const { title, address } = parkingZoneDto;

  const borderColor = '#FF9000';

  const translateDays = (days) => {
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days.map((d) => dayNames[d]).join(', ');
  };

  const formatTime = (time) => time.slice(0, 5); // HH:mm

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getEndDate = (startDate) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 1);
    return formatDate(date);
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
            <span><strong>С</strong></span>
            <span>{formatTime(startTime)}</span>
          </div>
          <div className="timeInfo">
            <span><strong>До</strong></span>
            <span>{formatTime(endTime)}</span>
          </div>
        </div>
        <div className="bookingCardContent">
          <p><strong>Адрес:</strong> {address}</p>
          <p><strong>Зона:</strong> {title}</p>
          <p><strong>Место №:</strong> {order}</p>
          <p><strong>Дни:</strong> {translateDays(dayOfWeak)}</p>
          <p><strong>Цена:</strong> {price / 100} ₽</p>
          <div className='inLine'>
            <span>Тип:</span>
            <span className="status" style={{ color: borderColor }}> Подписка</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseButton" onClick={closeModal}>×</button>

            <h3>Детали подписки</h3>
            <div className="modalGrid">
              <div className="modalSection">
                <h4>Период</h4>
                <p><strong>Дата начала:</strong> {formatDate(createTime)}</p>
                <p><strong>Дата окончания:</strong> {getEndDate(createTime)}</p>
              </div>

              <div className="modalSection">
                <h4>Время</h4>
                <p><strong>С:</strong> {formatTime(startTime)}</p>
                <p><strong>До:</strong> {formatTime(endTime)}</p>
                <p><strong>Дни:</strong> {translateDays(dayOfWeak)}</p>
              </div>

              <div className="modalSection">
                <h4>Место</h4>
                <p><strong>Адрес:</strong> {address}</p>
                <p><strong>Зона:</strong> {title}</p>
                <p><strong>Место №:</strong> {order}</p>
                {idOwner && (
                  <p><strong>Владелец:</strong> 
                    <Link 
                      to={`/user/dashboard/${idOwner}`} 
                      className="ownerLink"
                      onClick={(e) => e.stopPropagation()}
                    >
                      /user/dashboard/{idOwner}
                    </Link>
                  </p>
                )}
              </div>

              <div className="modalSection">
                <h4>Оплата</h4>
                <p><strong>Стоимость:</strong> {price / 100} ₽</p>
                <p><strong>Тип:</strong> <span style={{ color: borderColor }}>Подписка</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionCard;
