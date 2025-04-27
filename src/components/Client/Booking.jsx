import React, { useState, useEffect, useRef } from 'react';
import '../../css/booking.css'; // Для стилей
import { mockParkingSpaceBooking } from '../../dto/mock/ParkingSpaceBooking';

export default function Booking() {
  const timelineRef = useRef(null);
  const [dragging, setDragging] = useState(null); // 'start' | 'end' | null
  const [range, setRange] = useState({ start: 0, end: 24 }); // в часах [0–24]
  const [parkingSpaces, setParkingSpaces] = useState(null); // Состояние для парковочных мест
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [selectedDate, setSelectedDate] = useState(''); // Для выбранной даты
  const [selectedOption, setSelectedOption] = useState('Часы'); // Для выбранной длительности
  const [startTime, setStartTime] = useState(""); // Состояние для времени начала
  const [endTime, setEndTime] = useState(""); // Состояние для времени конца
  
  // Перевод пикселей в часы
  const pxToHours = (px) => {
    const width = timelineRef.current.clientWidth;
    return Math.min(24, Math.max(0, (px / width) * 24));
  };

  // Функция для преобразования часов в строку времени
  const timeToString = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '00')}`;
  };

  // При движении тачки
  const onMouseMove = (e) => {
    if (!dragging) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const h = pxToHours(x);
    setRange((r) => {
      const newRange = {
        ...r,
        [dragging]: dragging === 'start' ? Math.min(h, r.end) : Math.max(h, r.start),
      };

      // Обновляем время начала и конца
      if (dragging === 'start') {
        setStartTime(timeToString(newRange.start));
        console.log(newRange.start)
      }
      if (dragging === 'end') {
        setEndTime(timeToString(newRange.end));
        console.log(newRange.end)
      }

      return newRange;
    });

    // Показываем подсказки
  const tooltips = document.querySelectorAll('.time-tooltip');
  tooltips.forEach((tooltip) => {
    tooltip.style.opacity = 1; // Отображаем подсказки
  });
  };

  const onMouseUp = () => setDragging(null);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  // Функция для фетча данных с сервиса
  const fetchParkingSpaces = async () => {
    try {
      setLoading(true);
      // Временно используем mock данные
      setParkingSpaces(mockParkingSpaceBooking); // Устанавливаем моковые данные
    } catch (error) {
      console.error('Error fetching parking spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchParkingSpaces();
  }, []);

  // Рендерим метки часов сверху
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Если данные еще загружаются, отображаем индикатор загрузки
  if (loading) {
    return <div>Загрузка парковочных мест...</div>;
  }

  // Обработчик выбора даты
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    console.log(e.target.value)
  };

  // Обработчик выбора длительности
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log((option))
  };

  return (
    <div className="booking-container">
      {/* --- Блок с датой начала --- */}
      <div className="date-picker-container">
        <div className="date-picker-label">Дата начала</div>
        <div className="date-picker">
          <div className="calendar-icon">📅</div>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* --- Блок с длительностью --- */}
      <div className="duration-container">
        <div className="duration-label">Длительность</div>
        <div className="duration-options">
          {['Часы', 'Дни недели', 'Месяцы', 'Дни'].map((option) => (
            <button
              key={option}
              className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* --- Общий контейнер с временной шкалой и ползунками --- */}
      <div className="timeline-container">
  <div className="timeline-header">
    <div className="hours-scale" ref={timelineRef}>
      {hours.map((h) => (
        <div key={h} className="hour-tick">
          <span className="hour-label">{timeToString(h)}</span> {/* Добавляем форматированное время */}
        </div>
      ))}

      {/* Ползунки */}
      <div
        className="handle start-handle"
        style={{ left: `${(range.start / 24) * 100}%`, width: '16px' }}
        onMouseDown={() => setDragging('start')}
      />
      <div
        className="handle end-handle"
        style={{ left: `${(range.end / 24) * 100}%`, width: '16px' }}
        onMouseDown={() => setDragging('end')}
      />

      {/* Между ними — полупрозрачная зона выбора */}
      <div
        className="selected-range"
        style={{
          left: `${(range.start / 24) * 100}%`,
          width: `${((range.end - range.start) / 24) * 100}%`,
        }}
      />

      {/* Подсказки с временем для каждого ползунка */}
      <div
        className="time-tooltip"
        style={{ left: `${(range.start / 24) * 100}%` }}
      >
        {timeToString(range.start)}
      </div>
      <div
        className="time-tooltip"
        style={{ left: `${(range.end / 24) * 100}%` }}
      >
        {timeToString(range.end)}
      </div>
    </div>
  </div>

  {/* --- Список парковочных мест --- */}
  <div className="parking-selection-container">
    {parkingSpaces?.map((space) => (
      <div key={space.parkingSpaceDto.id} className="parking-space-row">
        <div className="parking-space-number">{space.parkingSpaceDto.order}</div>
        <div className="parking-space-bar">
          <div className="bar-bg" />
          {space.timeSlots?.map((slot, i) => {
            const s =
              slot.startTime.getHours() + slot.startTime.getMinutes() / 60;
            const e = slot.endTime.getHours() + slot.endTime.getMinutes() / 60;
            return (
              <div
                key={i}
                className="bar-busy"
                style={{
                  left: `${(s / 24) * 100}%`,
                  width: `${((e - s) / 24) * 100}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}
