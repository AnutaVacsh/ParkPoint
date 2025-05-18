import '../../css/bookingStyle.css';
import React, { useEffect, useState, useContext } from 'react';
import SearchRequestDTO from '../../dto/SearchRequestDTO';
import BookingCard from './BookingCard';
import { getOwnerBookingsWithPagination, getOwnerSubscriptions } from '../../api/BookingApi';
import { UserContext } from '../../contexts/UserContext';

const MyBookingOwner = () => {
  const { user } = useContext(UserContext);
  const userId = localStorage.getItem("userId");

  const [sortBy, setSortBy] = useState('startTime');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [filter, setFilter] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const sortOptions = [
    { value: 'dateCreated', label: 'Дате создания' },
    { value: 'startTime', label: 'Дате начала' },
    { value: 'endTime', label: 'Дате окончания' },
    { value: 'price', label: 'Стоимости' },
  ];

  const statusFilters = [
    { value: '', label: 'Все' },
    { value: 'PENDING', label: 'Ожидают подтверждения' },
    { value: 'CONFIRMED', label: 'Активные' },
    { value: 'COMPLETED', label: 'Завершенные' },
    { value: 'CANCELLED', label: 'Отмененные' },
    { value: 'REJECTED', label: 'Отклоненные' },
    { value: 'EXPIRED', label: 'Истекшие' },
    { value: 'SUBSCRIPTION', label: 'Подписки' }
  ];

  const convertSubscriptionToBooking = (subscription) => {
    const today = new Date();

    const subscriptionToJsDay = (day) => (day === 7 ? 0 : day);

    const getNextDateForDay = (targetDay) => {
      const jsDay = subscriptionToJsDay(targetDay);
      const daysUntilNext =
        jsDay >= today.getDay()
          ? jsDay - today.getDay()
          : 7 - today.getDay() + jsDay;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntilNext);
      return nextDate.toISOString().split('T')[0]; 
    };

    const nextDay = [...subscription.dayOfWeak]
      .sort((a, b) => {
        const d1 = (subscriptionToJsDay(a) - today.getDay() + 7) % 7;
        const d2 = (subscriptionToJsDay(b) - today.getDay() + 7) % 7;
        return d1 - d2;
      })[0];

    const nextDate = getNextDateForDay(nextDay);

    const toDateTime = (date, localTime) => `${date}T${localTime}`;

    return {
      id: subscription.id,
      client: subscription.client,
      parkingSpace: subscription.parkingSpace,
      startTime: toDateTime(nextDate, subscription.startTime),
      endTime: toDateTime(nextDate, subscription.endTime),
      dateCreated: null,
      status: 'SUBSCRIPTION',
      price: null,
    };
  };

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (filter === 'SUBSCRIPTION') {
          const subs = await getOwnerSubscriptions(userId);
          const converted = subs.map(convertSubscriptionToBooking);
          setBookings(converted);
          setTotalPages(1);
          setPage(1);
        } else if (filter === '') {

          const [bookingResp, subs] = await Promise.all([
            getOwnerBookingsWithPagination(userId, new SearchRequestDTO(page, 20, sortDirection, sortBy, filter)),
            getOwnerSubscriptions(userId)
          ]);

          const convertedSubs = subs.map(convertSubscriptionToBooking);

          let combined = [...bookingResp.content, ...convertedSubs];

          combined.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (valA == null) return 1;
            if (valB == null) return -1;

            if (sortBy.toLowerCase().includes('date') || sortBy.toLowerCase().includes('time')) {
              valA = new Date(valA).getTime();
              valB = new Date(valB).getTime();
            }

            if (valA < valB) return sortDirection === 'ASC' ? -1 : 1;
            if (valA > valB) return sortDirection === 'ASC' ? 1 : -1;
            return 0;
          });

          setBookings(combined);
          setTotalPages(bookingResp.totalPages); 
        } else {
          const request = new SearchRequestDTO(page, 20, sortDirection, sortBy, filter);
          const response = await getOwnerBookingsWithPagination(userId, request);
          setBookings(response.content);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, filter, sortBy, sortDirection, page]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === sortBy) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(value);
      setSortDirection('DESC');
    }
  };

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="myBookingPage">
      <div className="myBookingHeader">
        <div className="headerBackground">
          <h1 className="headerTitle">Мои брони и подписки</h1>
        </div>
      </div>

      <div className="myBookingContent">
        <nav className="myBookingNav">
          <ul className="navList">
            {statusFilters.map((status) => (
              <li key={status.value}>
                <button
                  className={`navButton ${filter === status.value ? 'active' : ''}`}
                  onClick={() => {
                    setFilter(status.value);
                    setPage(1);
                  }}
                >
                  {status.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sortControls">
          <div className="sortByContainer">
            <span className="sortLabel">Сортировать по:</span>
            <select className="sortSelect" value={sortBy} onChange={handleSortChange}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button
              className="sortDirectionButton"
              onClick={() => setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')}
            >
              {sortDirection === 'ASC' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="bookingsList">
          {loading ? (
            <div className="loadingIndicator">Загрузка...</div>
          ) : bookings.length === 0 ? (
            <div className="noResults">Нет бронирований и подписок</div>
          ) : (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>

        {/* Пагинация показывается, если фильтр не "SUBSCRIPTION" (подписки без пагинации) */}
        {filter !== 'SUBSCRIPTION' && totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Назад</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={pageNum === page ? 'active' : ''}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Вперед</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingOwner;
