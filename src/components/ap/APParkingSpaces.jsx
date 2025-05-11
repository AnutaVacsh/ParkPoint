import React, { useState, useEffect } from 'react';
import '../../css/adminDashboard.css';
import mockParkingSpacesAP from '../../dto/mock/MockParkingSpacesAP';

const APParkingSpaces = () => {
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ownerFilter, ] = useState('');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log(parkingSpaces)

  // Отправка запроса на сервер
  const fetchParkingSpaces = async (page, statusFilter, ownerFilter) => {
    setLoading(true);
    
    const requestDTO = {
      page: page,
      size: 10,
      sortDirection: "ASC",
      sortBy: "id",
      filters: [
        { field: "isAvailable", value: statusFilter, operator: "=" },
        // { field: "owner.email", value: ownerFilter, operator: "LIKE" }
      ]
    };

    try {
      const response = await fetch('http://localhost:8080/parking-spaces/get/all/pag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestDTO),
      });

      if (response.ok) {
        const data = await response.json();
        setParkingSpaces(data.content);
        setTotalPages(data.totalPages);
      } else {
        console.error("Ошибка при загрузке данных");
      }
    } catch (error) {
        setParkingSpaces(mockParkingSpacesAP)
      console.error("Ошибка при подключении к серверу", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchParkingSpaces(currentPage, statusFilter, ownerFilter);
  }, [currentPage, statusFilter, ownerFilter]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Активно';
      case 'INACTIVE': return 'Неактивно';
      case 'PENDING': return 'Ожидает';
      case 'REJECTED': return 'Отклонено';
      case 'BAN': return 'Заблокировано';
      default: return 'Неизвестно';
    }
  };

  const handleSpaceClick = (space) => {
    setSelectedSpace({
      ...space,
      zone: space.parkingZoneDto?.name,
      spotNumber: space.order,
      status: space.isAvailable,
      owner: space.owner,
      address: space.parkingZoneDto?.address,
      tariff: `Час: ${space.hourlyPrice}₽, День: ${space.dailyPrice}₽`
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleActionClick = async (id, status, action = null) => {
  let newState;
  
  if (status === 'ACTIVE' || status === 'INACTIVE') {
    newState = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  } else if (status === 'PENDING') {
    if (action === 'approve') {
      newState = 'ACTIVE';
    } else if (action === 'reject') {
      newState = 'REJECTED';
    }
  } else if (status === 'REJECTED' || status === 'BAN') {
    newState = 'ACTIVE';
  }

  if (newState) {
    try {
      const response = await fetch(`http://localhost:8080/parking-spaces/state/update?id=${id}&newState=${newState}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const updatedParkingSpace = await response.json()
        setParkingSpaces((prevSpaces) =>
          prevSpaces.map((space) =>
            space.id === id ? { ...space, isAvailable: newState } : space
          )
        );
        console.log(`Парковочное место с ID: ${id} успешно обновлено на статус: ${newState}`);
      } else {
        console.error('Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу', error);
    }
  }
};


  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">Парковочные места</h1>
        <div className="filters-container">
          <div className="filter">
            <label htmlFor="statusFilter">Статус:</label>
            <select 
              id="statusFilter" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Все</option>
              <option value="ACTIVE">Активно</option>
              <option value="INACTIVE">Неактивно</option>
              <option value="PENDING">Ожидает</option>
              <option value="REJECTED">Отклонено</option>
              <option value="BAN">Заблокировано</option>
            </select>
          </div>

          {/* <div className="filter">
            <label htmlFor="ownerFilter">Владелец:</label>
            <input
              id="ownerFilter"
              type="text"
              placeholder="Поиск по email..."
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            />
          </div> */}
        </div>
      </div>

      <div className="content">
        <div className="main">
          <div className="right-panel" style={{ flex: 1 }}>
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <table className="parking-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Парковочная зона</th>
                    <th>Владелец</th>
                    <th>Номер места</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {parkingSpaces && parkingSpaces.map((space) => (
                    <tr key={space.id} onClick={() => handleSpaceClick(space)} style={{ cursor: 'pointer' }}>
                        {console.log(space)}
                      <td>{space.id}</td>
                      <td>{space.parkingZoneDto?.title || 'Не указано'}</td>
                      <td>{space.owner?.email || 'Не указан'}</td>
                      <td>{space.order}</td>
                      <td>{getStatusLabel(space.isAvailable)}</td>
                      <td className='actionFlex' onClick={(e) => e.stopPropagation()}>
                        {space.isAvailable === 'ACTIVE' || space.isAvailable === 'INACTIVE' ? (
                          <button onClick={() => handleActionClick(space.id, space.isAvailable)} className="action-button">
                            Заблокировать
                          </button>
                        ) : ''}
                        {space.isAvailable === 'PENDING' ? (
                          <>
                            <button onClick={() => handleActionClick(space.id, space.isAvailable, 'approve')} className="action-button">
                              Подтвердить
                            </button>
                            <button onClick={() => handleActionClick(space.id, space.isAvailable, 'reject')} className="action-button">
                              Отклонить
                            </button>
                          </>
                        ) : ''}
                        {space.isAvailable === 'REJECTED' || space.isAvailable === 'BAN' ? (
                          <button onClick={() => handleActionClick(space.id, space.isAvailable)} className="action-button">
                            Разблокировать
                          </button>
                        ) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Назад
              </button>
              <span>Страница {currentPage} из {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                Вперед
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedSpace && (
        <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Парковочное место #{selectedSpace.id}</h2>

            <div className="modal-details">
                <p><strong>Зона:</strong> {selectedSpace.parkingZoneDto?.title || 'Не указана'}</p>
                <p><strong>Номер места:</strong> {selectedSpace.order}</p>
                <p><strong>Статус:</strong> {getStatusLabel(selectedSpace.isAvailable)}</p>
                <p>
                <strong>Владелец:</strong>{" "}
                <a href={`/user/dashboard/${selectedSpace.owner?.id}`} className="owner-link">
                    {selectedSpace.owner?.email || 'Не указан'}
                </a>
                </p>
                <p><strong>Адрес:</strong> {selectedSpace.parkingZoneDto?.address || 'Не указан'}</p>
                <p><strong>Описание:</strong> {selectedSpace.description || '—'}</p>
                <p><strong>Тариф:</strong></p>
                <ul>
                <li>Час: {selectedSpace.hourlyPrice/100}₽</li>
                <li>День: {selectedSpace.dailyPrice/100}₽</li>
                <li>Неделя: {selectedSpace.weeklyPrice/100}₽</li>
                <li>Месяц: {selectedSpace.monthlyPrice/100}₽</li>
                </ul>
            </div>

            <div className="modal-actions">
                <button className="action-button">Изменить</button>
                <button className="action-button danger">Удалить</button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
};

export default APParkingSpaces;
