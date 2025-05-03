import React, { useState, useEffect } from 'react';
import '../../../css/booking.css';
import { mockParkingSpaceBooking } from '../../../dto/mock/ParkingSpaceBooking';
import TimeLine from './Timeline';
import { useNavigate, useParams } from 'react-router-dom';


const DURATION_OPTIONS = ['Часы', 'Дни', 'Месяцы'];

const MONTH_NAMES_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export default function Booking() {
  const [, setParkingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOption, setSelectedOption] = useState('Часы');
  const [selectionSpace, setSelectionSpace] = useState('');
  const [range, setRange] = useState({ start: { major: 0, minor: 0 }, end: { major: 1, minor: 0 } });
  const [price, setPrice] = useState(0);
  const {id} = useParams();

  useEffect(() => {
    setLoading(true);
    setParkingSpaces(mockParkingSpaceBooking);
    setLoading(false);
  }, []);

  const navigate = useNavigate();

  const handleBooking = async () => {
    if (!validateBooking()) return;
  
    const start = new Date(selectedDate);
    let end = new Date(start);
  
    // Обработка в зависимости от выбранной опции
    if (selectedOption === 'Часы') {
      start.setHours(range.start.major, range.start.minor);
      end.setHours(range.end.major, range.end.minor);
    } else if (selectedOption === 'Дни') {
      start.setDate(start.getDate() + range.start.major);
      start.setHours(range.start.minor);
      end.setDate(end.getDate() + range.end.major);
      end.setHours(range.end.minor);
    } else if (selectedOption === 'Месяцы') {
      start.setMonth(start.getMonth() + range.start.major);
      start.setDate(start.getDate() + range.start.minor);
      start.setHours(range.start.minor);
      end.setMonth(end.getMonth() + range.end.major);
      end.setDate(end.getDate() + range.end.minor);
      end.setHours(range.end.minor);
    }
  
    const startTime = toLocalISOString(start);
    const endTime = toLocalISOString(end);
  
    const bookingRequest = {
      clientId: localStorage.getItem("userId"),
      parkingSpaceId: selectionSpace.id,
      startTime,
      endTime,
      price
    };
  
    try {
      const response = await fetch('http://localhost:8080/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingRequest)
      });
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      navigate(`/client/parking/${id}/booking/confirmation/${selectionSpace.id}/${encodeURIComponent(startTime)}/${encodeURIComponent(endTime)}`);
    } catch (error) {
      console.error('Не удалось создать бронирование:', error);
      alert('Ошибка при создании бронирования. Попробуйте позже.');
    }
  };
  

  const validateBooking = () => {
    if (!selectedDate || !selectionSpace) {
      alert('Пожалуйста, выберите парковочное место и дату начала.');
      return false;
    }
    return true;
  };

  function toLocalISOString(date) {
    const pad = (n) => n.toString().padStart(2, '0');
  
    const year   = date.getFullYear();
    const month  = pad(date.getMonth() + 1);
    const day    = pad(date.getDate());
    const hours  = pad(date.getHours());
    const mins   = pad(date.getMinutes());
  
    return `${year}-${month}-${day}T${hours}:${mins}`;
  }
  

  const getMinorDivisor = () => {
    switch (selectedOption) {
      case 'Часы': return 60;
      case 'Месяцы': return 31;
      default: return 24;
    }
  };

  const positionToLabel = ({ major, minor }) => {
    if (!selectedDate || isNaN(new Date(selectedDate))) return '';
  
    const baseDate = new Date(selectedDate);
    const resultDate = new Date(baseDate);
  
    switch (selectedOption) {
      case 'Часы': {
        const totalMinutes = major * 60 + minor;
        const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const minutes = Math.round(totalMinutes % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      case 'Дни':
      case 'Дни недели': {
        resultDate.setDate(resultDate.getDate() + major);
        resultDate.setHours(resultDate.getHours() + minor);
        const day = resultDate.getDate();
        const monthName = MONTH_NAMES_RU[resultDate.getMonth()];
        return `${day} ${monthName}`;
      }
      case 'Месяцы': {
        resultDate.setMonth(resultDate.getMonth() + major);
        resultDate.setDate(resultDate.getDate() + minor);
        const day = resultDate.getDate();
        const monthName = MONTH_NAMES_RU[resultDate.getMonth()];
        return `${day} ${monthName}`;
      }
      default:
        return '';
    }
  };

  const getUnitPrice = (option) => {
    if (!selectionSpace) return 0;
    if (option === 'Часы') return selectionSpace.hourlyPrice;
    if (option === 'Дни') return selectionSpace.dailyPrice;
    if (option === 'Месяцы') return selectionSpace.monthlyPrice;
    return 0;
  };

  function pluralize(n, forms) {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  }
  
  function getDurationText(range, option) {
    const startMins = range.start.major * getMinorDivisor() + range.start.minor;
    const endMins   = range.end.major   * getMinorDivisor() + range.end.minor;
    const totalMins = endMins - startMins;
  
    if (option === 'Часы') {
      const hours = totalMins / 60;
      return `${hours.toFixed(2)} ${pluralize(Math.floor(hours), ['час', 'часа', 'часов'])}`;
    }
    if (option === 'Дни' || option === 'Дни недели') {
      const days = totalMins / (24);
      return `${days.toFixed(2)} ${pluralize(Math.floor(days), ['день', 'дня', 'дней'])}`;
    }
    if (option === 'Месяцы') {
      const months = totalMins / (30);
      return `${months.toFixed(2)} ${pluralize(Math.floor(months), ['месяц', 'месяца', 'месяцев'])}`;
    }
    return '';
  }
  
  const calculatePrice = (range, option) => {
    if (!selectedDate || !selectionSpace) {
      setPrice(0);
      return 0;
    }
  
    const startMins = range.start.major * getMinorDivisor() + range.start.minor;
    const endMins = range.end.major * getMinorDivisor() + range.end.minor;
    const totalMins = endMins - startMins;
    
    let calculatedPrice = 0;
    
    if (option === 'Часы') {
      calculatedPrice = +(totalMins / 60 * getUnitPrice(option)).toFixed(2);
    } else if (option === 'Дни' || option === 'Дни недели') {
      calculatedPrice = +(totalMins / (24) * getUnitPrice(option)).toFixed(2);
    } else if (option === 'Месяцы') {
      calculatedPrice = +(totalMins / (30) * getUnitPrice(option)).toFixed(2);
    }
    
    setPrice(calculatedPrice);
    return calculatedPrice;
  };

  useEffect(() => {
    if (selectedDate && selectionSpace) {
      calculatePrice(range, selectedOption);
    }
  }, [range, selectedOption, selectedDate, selectionSpace]);
  

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setRange({ start: { major: 0, minor: 0 }, end: { major: 1, minor: 0 } });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (loading) return <div>Загрузка парковочных мест...</div>;

  return (
    <div className="booking-container">
      {/* Дата начала */}
      <div className="date-picker-container">
        <div className="date-picker-label">Дата начала</div>
        <div className="date-picker">
          <div className="calendar-icon">📅</div>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        </div>
      </div>

      {/* Длительность */}
      <div className="duration-container">
        <div className="duration-label">Длительность</div>
        <div className="duration-options">
          {DURATION_OPTIONS.map(option => (
            <button
              key={option}
              className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {selectedDate && (
        <TimeLine
          selectedDate={selectedDate}
          endDate={endDate}
          selectedOption={selectedOption}
          selectionSpace={selectionSpace}
          range={range}
          setSelectedDate={setSelectedDate}
          setEndDate={setEndDate}
          setSelectedOption={setSelectedOption}
          setSelectionSpace={setSelectionSpace}
          setRange={setRange}
        />
      )}
      

      {/* Итог */}
     <div className="summary-container">
        <h2 className="summary-title">Итог</h2>

        <div className="summary-time-block">
          <div className="time-column">
            <div className="time-label">Начало</div>
            <div className="time-value">{positionToLabel(range.start)}</div>
          </div>
          <div className="time-column">
            <div className="time-label">Конец</div>
            <div className="time-value">{positionToLabel(range.end)}</div>
          </div>
        </div>

        <div className="summary-price">
          <div className="summary-row">
            <span>Общее время:</span>
            <span>{getDurationText(range, selectedOption)}</span>
          </div>
          <div className="summary-row">
            <span>Стоимость за {selectedOption.toLowerCase()}:</span>
            <span>{getUnitPrice(selectedOption)} ₽</span>
          </div>
          <hr className="summary-divider" />
          <div className="summary-row total">
            <span>Итоговая стоимость:</span>
            <span>{price} ₽</span> {/* Используем состояние price */}
          </div>
        </div>

        <div className="summary-buttons">
          <button className="btn-yellow" onClick={handleBooking}>
            Забронировать
          </button>
          <button className="btn-yellow">Оформить подписку на место</button>
        </div>
      </div>
    </div>
  );
}
