import '../../css/bookingStyle.css';
import React, { useEffect, useState } from 'react';
import BookingCard from './BookingCard';
import SearchRequestDTO from '../../dto/SearchRequestDTO';
import { getAllSubscriptionsForUser, getBookingsWithPagination } from '../../api/BookingApi';
import SubscriptionCard from './booking/SubscriptionCard';

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState('BOOKING'); // BOOKING | SUBSCRIPTION
  const [sortBy, setSortBy] = useState('startTime');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [filter, setFilter] = useState('');
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const sortOptions = [
    { value: 'dateCreated', label: 'Дате создания' },
    { value: 'startTime', label: 'Дате начала' },
    { value: 'endTime', label: 'Дате окончания' },
    { value: 'price', label: 'Стоимости' }
  ];

  const statusFilters = [
    { value: '', label: 'Все' },
    { value: 'PENDING', label: 'Ожидают подтверждения' },
    { value: 'CONFIRMED', label: 'Активные' },
    { value: 'COMPLETED', label: 'Завершенные' },
    { value: 'CANCELLED', label: 'Отмененные' },
    { value: 'REJECTED', label: 'Отклоненные' },
    { value: 'EXPIRED', label: 'Истекшие' }
  ];

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const request = new SearchRequestDTO(
          page,
          20,
          sortDirection,
          sortBy,
          filter
        );
        const response = await getBookingsWithPagination(request);
        setBookings(response.content);
        setTotalPages(response.totalPages);
      } catch (e) {
        console.error('Ошибка загрузки бронирований:', e);
      } finally {
        setLoading(false);
      }
    };

    const loadSubscriptions = async () => {
      setLoading(true);
      try {
        const subs = await getAllSubscriptionsForUser(localStorage.getItem('userId'));
        setSubscriptions(subs);
      } catch (e) {
        console.error('Ошибка загрузки подписок:', e);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'BOOKING') {
      loadBookings();
    } else {
      loadSubscriptions();
    }
  }, [activeTab, filter, sortBy, sortDirection, page]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === sortBy) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(value);
      setSortDirection('DESC');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="myBookingPage">
      <div className="myBookingHeader">
        <div className="headerBackground">
          <h1 className="headerTitle">Мои брони</h1>
        </div>
      </div>

      <div className="myBookingContent">
        {/* Переключатель вкладок */}
        <div className="tabSelector">
          <button
            className={`navButton ${activeTab === 'BOOKING' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('BOOKING');
              setPage(1);
            }}
          >
            Бронирования
          </button>
          <button
            className={`navButton ${activeTab === 'SUBSCRIPTION' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('SUBSCRIPTION');
              setPage(1);
            }}
          >
            Подписки
          </button>
        </div>
        <br/>

        {/* Фильтры и сортировка — только для бронирований */}
        {activeTab === 'BOOKING' && (
          <>
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
                <select
                  className="sortSelect"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="sortDirectionButton"
                  onClick={() =>
                    setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')
                  }
                >
                  {sortDirection === 'ASC' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Контент */}
        <div className="bookingsList">
          {loading ? (
            <div className="loadingIndicator">Загрузка...</div>
          ) : activeTab === 'BOOKING' ? (
            bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="noResults">Нет бронирований</div>
            )
          ) : subscriptions.length > 0 ? (
            subscriptions.map((subscription, index) => (
              <SubscriptionCard key={index} subscription={subscription} />
            ))
          ) : (
            <div className="noResults">Нет подписок</div>
          )}
        </div>

        {/* Пагинация (только для бронирований) */}
        {activeTab === 'BOOKING' && totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
              Назад
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={pageNum === page ? 'active' : ''}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
              Вперед
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
