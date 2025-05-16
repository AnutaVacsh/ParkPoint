import { useEffect, useRef, useState } from "react";
import { mockParkingSpaceBooking } from "../../../dto/mock/ParkingSpaceBooking";
import { useParams } from "react-router-dom";

const WEEK_DAYS_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTH_NAMES_RU = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
];

export default function TimeLine({
  selectedDate,
  selectedOption,
  range,
  setRange,
  selectionSpace,
  setSelectionSpace,
  setIsUnavailable,
  isUnavailable
}) {
  const { id } = useParams();
  const timelineRef = useRef(null);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);
  const [timelineValues, setTimelineValues] = useState([]);

  useEffect(() => {
    const baseDate = new Date(selectedDate);
    const values = [];

    switch (selectedOption) {
      case 'Часы':
        for (let i = 0; i < 24; i++) {
          const d = new Date(baseDate);
          d.setHours(i, 0, 0, 0);
          values.push(d);
        }
        break;
      case 'Дни':
      case 'Дни недели':
        for (let i = 0; i < 7; i++) {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() + i);
          values.push(d);
        }
        break;
      case 'Месяцы':
        for (let i = 0; i < 12; i++) {
          const d = new Date(baseDate);
          d.setMonth(baseDate.getMonth() + i);
          values.push(d);
        }
        break;
      default:
        break;
    }

    setTimelineValues(values);
  }, [selectedOption, selectedDate]);

  useEffect(() => {
    if (!selectionSpace || !range || !timelineValues.length) {
      setIsUnavailable(false);
      return;
    }

    const startDate = positionToDate(range.start);
    const endDate = positionToDate(range.end);

    const selectedSpace = parkingSpaces.find(space => space.parkingSpaceDto.id === selectionSpace.id);
    if (!selectedSpace) {
      setIsUnavailable(false);
      return;
    }

    const hasOverlap = selectedSpace.timeSlots.some(slot => {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      return startDate < slotEnd && endDate > slotStart;
    });

    setIsUnavailable(hasOverlap);
  }, [range, selectionSpace, timelineValues]);

  useEffect(() => {
  if (!selectionSpace || !range || !timelineValues.length) {
    console.log("Недостаточно данных для проверки доступности");
    setIsUnavailable(false);
    return;
  }

  const startDate = positionToDate(range.start);
  const endDate = positionToDate(range.end);

  console.log("Проверка на доступность:", {
    selectionSpace,
    range,
    startDate,
    endDate
  });

  const selectedSpaceWrapper = parkingSpaces.find(space => space.parkingSpaceDto.id === selectionSpace.id);

  if (!selectedSpaceWrapper) {
    console.warn("Не найдено парковочное место с id:", selectionSpace.id);
    setIsUnavailable(false);
    return;
  }

  const hasOverlap = selectedSpaceWrapper.timeSlots.some(slot => {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);
    return startDate < slotEnd && endDate > slotStart;
  });

  console.log("Результат проверки занятости:", hasOverlap);
  setIsUnavailable(hasOverlap);
}, [range, selectionSpace, timelineValues, parkingSpaces]);

  const positionToDate = ({ major, minor }) => {
    const base = new Date(timelineValues[major]);
    switch (selectedOption) {
      case 'Часы':
        base.setMinutes(minor);
        break;
      case 'Дни':
      case 'Дни недели':
        base.setHours(minor);
        break;
      case 'Месяцы':
        base.setDate(base.getDate() + minor);
        break;
      default:
        break;
    }
    return base;
  };

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/parking-spaces/get/list/${id}`);
        if (!res.ok) throw new Error("Ошибка загрузки парковочных мест");
        const data = await res.json();

        const parsed = data.map(space => ({
          parkingSpaceDto: space.parkingSpaceDto,
          timeSlots: space.timeSlots.map(slot => ({
            ...slot,
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime)
          }))
        }));

        setParkingSpaces(parsed);
      } catch (err) {
        setParkingSpaces(mockParkingSpaceBooking);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSpaces();
  }, [id]);

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
    };

    const onMouseUp = () => setDragging(null);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, timelineValues, selectedOption, setRange]);

  const pxToPosition = (px) => {
    const width = timelineRef.current.clientWidth;
    const segments = timelineValues.length - 1;
    const majorRaw = (px / width) * segments;
    const major = Math.floor(majorRaw);
    const minor = Math.round((majorRaw - major) * getMinorDivisor());
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
    const value = timelineValues[major];
    if (!value) return '—';

    const date = new Date(value);
    switch (selectedOption) {
      case 'Часы':
        date.setMinutes(date.getMinutes() + minor);
        return date.toTimeString().slice(0, 5);
      case 'Дни':
        date.setHours(date.getHours() + minor);
        return `${date.getDate()} ${MONTH_NAMES_RU[date.getMonth()]}`;
      case 'Дни недели':
        date.setHours(date.getHours() + minor);
        return WEEK_DAYS_RU[date.getDay()];
      case 'Месяцы':
        date.setDate(date.getDate() + minor);
        return `${MONTH_NAMES_RU[date.getMonth()]}`;
      default:
        return '—';
    }
  };

  const comparePositions = (a, b) => (a.major - b.major) || (a.minor - b.minor);

  const handleSpaceClick = (space) => {
    setSelectionSpace(space);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <div className="null" />
        <div className="hours-scale" ref={timelineRef}>
          {timelineValues.map((_, i) => (
            <div key={i} className="hour-tick">
              <span className="hour-label">{positionToLabel({ major: i, minor: 0 })}</span>
            </div>
          ))}

          {['start', 'end'].map(type => (
            <div
              key={type}
              className={`handle ${type}-handle`}
              style={{ left: `${calculatePercent(range[type])}%` }}
              onMouseDown={() => setDragging(type)}
            />
          ))}

          <div
            className={`selected-range ${isUnavailable ? 'unavailable' : ''}`}
            style={{
              left: `${calculatePercent(range.start)}%`,
              width: `${calculatePercent(range.end) - calculatePercent(range.start)}%`
            }}
          />
          {console.log(isUnavailable)}

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

      <div className="parking-selection-container">
        {parkingSpaces.map(space => (
          <div key={space.parkingSpaceDto.id} className="parking-space-row">
            <div
              className={`parking-space-number ${selectionSpace?.id === space.parkingSpaceDto.id ? 'selected' : ''}`}
              onClick={() => handleSpaceClick(space.parkingSpaceDto)}
            >
              {space.parkingSpaceDto.order}
            </div>
            <div className="parking-space-bar">
              <div className="bar-bg" />
              {space.timeSlots.map((slot, idx) => {
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  const selectedDateObj = new Date(selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0);

  let startPosition = 0;
  let endPosition = 0;

  switch (selectedOption) {
    case 'Часы': {
      const startTimeInMinutes = (start - selectedDateObj) / (1000 * 60);
      const endTimeInMinutes = (end - selectedDateObj) / (1000 * 60);
      startPosition = startTimeInMinutes / (60 * 24);
      endPosition = endTimeInMinutes / (60 * 24);
      break;
    }
    case 'Дни': {
      const daysDifferenceStart = (start - selectedDateObj) / (1000 * 60 * 60 * 24);
      const daysDifferenceEnd = (end - selectedDateObj) / (1000 * 60 * 60 * 24);
      startPosition = daysDifferenceStart / (timelineValues.length - 1);
      endPosition = daysDifferenceEnd / (timelineValues.length - 1);
      break;
    }
    case 'Дни недели': {
      startPosition = (start.getDay() + start.getHours() / 24) / 7;
      endPosition = (end.getDay() + end.getHours() / 24) / 7;
      break;
    }
    case 'Месяцы': {
      const timelineStartMonth = new Date(timelineValues[0]).getMonth();
      const startMonth = start.getMonth();
      const endMonth = end.getMonth();
      const daysInStartMonth = new Date(start.getFullYear(), startMonth + 1, 0).getDate();
      const daysInEndMonth = new Date(end.getFullYear(), endMonth + 1, 0).getDate();
      const startMonthOffset = (startMonth - timelineStartMonth + 12) % 12;
      const endMonthOffset = (endMonth - timelineStartMonth + 12) % 12;
      startPosition = (startMonthOffset + start.getDate() / daysInStartMonth) / timelineValues.length;
      endPosition = (endMonthOffset + end.getDate() / daysInEndMonth) / timelineValues.length;
      break;
    }
    default:
      break;
  }

  const startPercent = startPosition * 100;
  const widthPercent = (endPosition - startPosition) * 100;

  // Минимальная ширина 2 пикселя
  const minWidth = 0.2; // пикселей
  const actualWidth = widthPercent < minWidth ? minWidth : widthPercent;

  return (
    <div
      key={idx}
      className="bar-busy"
      style={{
        left: `${startPercent}%`,
        width: `${actualWidth}%`
      }}
    />
  );
})}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
