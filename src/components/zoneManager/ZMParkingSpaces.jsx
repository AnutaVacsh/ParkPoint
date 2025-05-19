import React, { useState, useEffect } from 'react';
import '../../css/adminDashboard.css';
import mockParkingSpacesAP from '../../dto/mock/MockParkingSpacesAP';

const ZMParkingSpaces = () => {
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusEdits, setStatusEdits] = useState({});

  const fetchParkingSpaces = async () => {
    setLoading(true);

    const filters = [
      { field: 'parkingZone.zoneManager.id', value: localStorage.getItem('userId'), operator: '=' },
    ];
    if (statusFilter !== 'ALL') {
      filters.push({ field: 'isAvailable', value: statusFilter, operator: '=' });
    }

    const requestDTO = {
      page: currentPage,
      size: 10,
      sortDirection: 'ASC',
      sortBy: 'id',
      filters
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
        console.error('Ошибка при загрузке данных');
      }
    } catch (error) {
      setParkingSpaces(mockParkingSpacesAP);
      console.error('Ошибка при подключении к серверу', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchParkingSpaces();
  }, [currentPage, statusFilter]);

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

const handleDeleteClick = async () => {
  if (!selectedSpace) return;

  const confirmDelete = window.confirm(`Вы действительно хотите удалить парковочное место #${selectedSpace.id}?`);
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8080/parking-spaces/delete/${selectedSpace.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert(`Парковочное место #${selectedSpace.id} успешно удалено.`);
      setShowModal(false);
      // После удаления обновим список парковочных мест
      fetchParkingSpaces();
    } else {
      alert('Ошибка при удалении парковочного места.');
    }
  } catch (error) {
    alert('Ошибка при подключении к серверу.');
    console.error(error);
  }
};


  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">Мои парковочные места</h1>
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
                    <th>Зона</th>
                    <th>Владелец</th>
                    <th>Место</th>
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
                        {(space.isAvailable === 'ACTIVE' || space.isAvailable === 'INACTIVE') && (
                          <button
                            onClick={() => handleActionClick(space.id, space.isAvailable)}
                            className="action-button"
                          >
                            {space.isAvailable === 'ACTIVE' ? 'Заблокировать' : 'Разблокировать'}
                          </button>
                        )}
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
                Вперёд
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
              <p><strong>Зона:</strong> {selectedSpace.parkingZoneDto?.title}</p>
              <p><strong>Номер:</strong> {selectedSpace.order}</p>
              <p><strong>Статус:</strong> {getStatusLabel(selectedSpace.isAvailable)}</p>
              <p><strong>Владелец:</strong> {selectedSpace.owner?.email || '—'}</p>
              <p><strong>Адрес:</strong> {selectedSpace.parkingZoneDto?.address}</p>
              <p><strong>Описание:</strong> {selectedSpace.description || '—'}</p>
              <p><strong>Тарифы:</strong></p>
              <ul>
                <li>Час: {selectedSpace.hourlyPrice / 100}₽</li>
                <li>День: {selectedSpace.dailyPrice / 100}₽</li>
                <li>Неделя: {selectedSpace.weeklyPrice / 100}₽</li>
                <li>Месяц: {selectedSpace.monthlyPrice / 100}₽</li>
              </ul>
            </div>
            {/* <button className="delete-button" onClick={handleDeleteClick}>
                Удалить парковочное место
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZMParkingSpaces;
