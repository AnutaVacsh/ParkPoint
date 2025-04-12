import React from 'react';
import '../../css/bookingCardStyle.css';


const BookingCard = ({ booking }) => {
  const { startTime, endTime, status, parkingSpace } = booking;
  
  const { price, parkingZoneDto, order } = parkingSpace;
  
  const { title, address} = parkingZoneDto;

  console.log(booking)

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#FEE174';
      case 'CONFIRMED':
        return '#9DFE74';
      case 'REJECTED':
        return '#FE7974';
      case 'CANCELLED':
      case 'COMPLETED':
      case 'EXPIRED':
        return '#A8A8A8';
      default:
        return '#FFFFFF';
    }
  };

  const borderColor = getStatusColor(status);

  function cancel(){

  }

  function review(){
    
  }

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

  return (
    <div className="bookingCard" style={{ borderColor }}>
      <div className="bookingCardHeader">
        <div className="timeInfo">
          <span><strong>Начало</strong></span>
          <span>{formatDate(startTime)}</span>
        </div>
        <div className="arrow"> &gt;&gt; </div>
        <div className="timeInfo">
          <span><strong>Выезд</strong></span>
          <span>{formatDate(endTime)}</span>
        </div>
      </div>
      <div className="bookingCardContent">
        <p><strong>Адрес:</strong> {address}</p>
        <p><strong>Название:</strong> {title}</p>
        <p><strong>Номер места:</strong> {order}</p>
        <p><strong>Стоимость:</strong> {price/100}</p>
        <div className='inLine'>
            <span>Статус:</span>
            <span className="status" style={{ color: borderColor }}> {status}</span>
        </div>

        <div className="bookingActions">
            {['PENDING', 'CONFIRMED'].includes(booking.status) && (
            <button className="actionButton cancelButton" onClick={cancel()}>Отменить</button>
            )}
            {booking.status === 'COMPLETED' && (
            <button className="actionButton reviewButton" onClick={review()}>Оставить отзыв</button>
            )}
        </div>
        </div>
    </div>
  );
};

export default BookingCard;
