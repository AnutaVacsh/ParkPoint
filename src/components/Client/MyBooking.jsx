import '../../css/bookingStyle.css';

import React, { useEffect, useState } from 'react';
import SearchRequestDTO from '../../dto/SearchRequestDTO';
import BookingCard from './BookingCard';
import { getBookingsWithPagination } from '../../api/BookingApi';  // Импортируйте вашу функцию

const MyBooking = () => {
  const [sortBy, setSortBy] = useState('startTime');
  const [filter, setFilter] = useState('null');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const sortOptions = ['Дата', 'По алфавиту', 'По цене'];

  // Функция для загрузки бронирований
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const request = new SearchRequestDTO(1, 20, 'ASC', sortBy, filter);

      const data = await getBookingsWithPagination(request);
      setBookings(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  // Перезагрузка данных при изменении фильтра или сортировки
  useEffect(() => {
    fetchBookings();
  }, [filter, sortBy]);

  return (
    <div className="myBookingPage">
      <div className="myBookingHeader">
        <div className="headerBackground">
          <h1 className="headerTitle">Мои брони</h1>
        </div>
      </div>

      <div className="myBookingContent">
        <nav className="myBookingNav">
          <ul className="navList">
            <li>
              <button
                className={`navButton ${filter === '' ? 'active' : ''}`}
                onClick={() => setFilter('')}
              >
                Все
              </button>
            </li>
            <li>
              <button
                className={`navButton ${filter === 'CONFIRMED' ? 'active' : ''}`}
                onClick={() => setFilter('CONFIRMED')}
              >
                Активные
              </button>
            </li>
            <li>
              <button
                className={`navButton ${filter === 'PENDING' ? 'active' : ''}`}
                onClick={() => setFilter('PENDING')}
              >
                Ждут подтверждения
              </button>
            </li>
            <li>
              <button
                className={`navButton ${filter === 'COMPLETED' ? 'active' : ''}`}
                onClick={() => setFilter('COMPLETED')}
              >
                Завершённые
              </button>
            </li>
            <li>
              <button
                className={`navButton ${filter === 'REJECTED' ? 'active' : ''}`}
                onClick={() => setFilter('REJECTED')}
              >
                Отклонённые
              </button>
            </li>
            <li>
              <button
                className={`navButton ${filter === 'CANCELLED' ? 'active' : ''}`}
                onClick={() => setFilter('CANCELLED')}
              >
                Отменённые
              </button>
            </li>
          </ul>
        </nav>

        <div className="sortByContainer">
          <span className="sortLabel">Сортировать по:</span>
          <select
            className="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Выберите сортировку</option>
            {sortOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="bookingsList">
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            bookings.map((booking, index) => (
              <BookingCard key={index} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooking;
