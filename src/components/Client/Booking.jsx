import React, { useState, useEffect, useRef } from 'react';
import '../../css/booking.css';
import { mockParkingSpaceBooking } from '../../dto/mock/ParkingSpaceBooking';

const DURATION_OPTIONS = ['Часы', 'Дни', 'Дни недели', 'Месяцы'];

const TIMELINE_LABELS = {
  'Часы': Array.from({ length: 25 }, (_, i) => i),
  'Дни': Array.from({ length: 8 }, (_, i) => `День ${i}`),
  'Дни недели': ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  'Месяцы': ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
};

export default function Booking() {
  const timelineRef = useRef(null);

  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(''); // Дата начала
  const [endDate, setEndDate] = useState(''); // Дата конца
  const [selectedOption, setSelectedOption] = useState('Часы');
  const [selectionSpace, setSelectionSpace] = useState('');
  const [range, setRange] = useState({ start: { major: 0, minor: 0 }, end: { major: 1, minor: 0 } });
  const [dragging, setDragging] = useState(null);

  const timelineValues = TIMELINE_LABELS[selectedOption] || [];

  useEffect(() => {
    setLoading(true);
    setParkingSpaces(mockParkingSpaceBooking);
    setLoading(false);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const pos = pxToPosition(x);

      setRange(prev => {
        const updated = {
          ...prev,
          [dragging]: dragging === 'start'
            ? (comparePositions(pos, prev.end) <= 0 ? pos : prev.end)
            : (comparePositions(pos, prev.start) >= 0 ? pos : prev.start)
        };
        return updated;
      });
      
      console.log(range.start, range.end);

      document.querySelectorAll('.time-tooltip').forEach(tooltip => {
        tooltip.style.opacity = 1;
      });
    };

    const onMouseUp = () => setDragging(null);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, timelineValues, selectedOption]);

  const pxToPosition = (px) => {
    const width = timelineRef.current.clientWidth;
    const segments = timelineValues.length - 1;
    const majorRaw = (px / width) * segments;
    const major = Math.floor(majorRaw);
    const minor = (majorRaw - major) * getMinorDivisor();
    return { major, minor };
  };

  const getMinorDivisor = () => {
    switch (selectedOption) {
      case 'Часы': return 60;
      case 'Месяцы': return 31;
      default: return 24;
    }
  };

  const calculatePercent = ({ major, minor }) => {
    const segments = timelineValues.length - 1;
    return ((major + minor / getMinorDivisor()) / segments) * 100;
  };

  const positionToLabel = ({ major, minor }) => {
    const value = timelineValues[major] ?? timelineValues.at(-1);
    switch (selectedOption) {
      case 'Часы':
        const totalMinutes = major * 60 + minor;
        const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const minutes = Math.round(totalMinutes % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      case 'Дни':
      case 'Дни недели':
        return `${value} +${Math.floor(minor)}ч`;
      case 'Месяцы':
        return `${value} +${Math.floor(minor)}д`;
      default:
        return '';
    }
  };

  const comparePositions = (a, b) => (a.major - b.major) || (a.minor - b.minor);

  const handleOptionChange = (option) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Выбрана опция:`, option); // Логируем выбор опции с временем
    setSelectedOption(option);
    setRange({ start: { major: 0, minor: 0 }, end: { major: 1, minor: 0 } });
  };

  const handleDateChange = (e) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Выбрана дата начала:`, e.target.value); // Логируем выбор даты начала с временем
    setSelectedDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Выбрана дата конца:`, e.target.value); // Логируем выбор даты конца с временем
    setEndDate(e.target.value);
  };

  const handleSpaceClick = (spaceId) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Выбрано парковочное место:`, spaceId); // Логируем выбор парковочного места с временем
    setSelectionSpace(spaceId);
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

      {/* Таймлайн */}
      <div className="timeline-container">
        <div className="timeline-header">
          <div className='null' />
          <div className="hours-scale" ref={timelineRef}>
            {timelineValues.map((label, idx) => (
              <div key={idx} className="hour-tick">
                <span className="hour-label">{label}</span>
              </div>
            ))}

            {/* Ползунки */}
            {['start', 'end'].map(type => (
              <div
                key={type}
                className={`handle ${type}-handle`}
                style={{ left: `${calculatePercent(range[type])}%`, width: '16px' }}
                onMouseDown={() => setDragging(type)}
              />
            ))}

            <div
              className="selected-range"
              style={{
                left: `${calculatePercent(range.start)}%`,
                width: `${calculatePercent(range.end) - calculatePercent(range.start)}%`,
              }}
            />

            {/* Подсказки */}
            {['start', 'end'].map(type => (
              <div
                key={type}
                className="time-tooltip"
                style={{ left: `${calculatePercent(range[type])}%` }}
              >
                {positionToLabel(range[type])}
              </div>
            ))}
          </div>
        </div>

        {/* Парковочные места */}
        <div className="parking-selection-container">
          {parkingSpaces.map(space => (
            <div key={space.parkingSpaceDto.id} className="parking-space-row">
              <div
                className={`parking-space-number ${selectionSpace === space.parkingSpaceDto.id ? 'selected' : ''}`}
                onClick={() => handleSpaceClick(space.parkingSpaceDto.id)}
              >
                {space.parkingSpaceDto.order}
              </div>
              <div className="parking-space-bar">
                <div className="bar-bg" />
                {space.timeSlots.map((slot, idx) => {
                  const start = slot.startTime.getHours() + slot.startTime.getMinutes() / 60;
                  const end = slot.endTime.getHours() + slot.endTime.getMinutes() / 60;
                  return (
                    <div
                      key={idx}
                      className="bar-busy"
                      style={{
                        left: `${(start / 24) * 100}%`,
                        width: `${((end - start) / 24) * 100}%`,
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
