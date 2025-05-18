import React, { useState, useEffect } from 'react';

const fallbackParkingZones = []; 

const ZMParkingZones = () => {
  const [parkingZones, setParkingZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedZone, setSelectedZone] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Берём managerId из localStorage
  const managerId = localStorage.getItem('userId');

  const fetchParkingZones = async (page, status) => {
  setLoading(true);

  const filters = [];

  if (status !== 'ALL') {
    filters.push({ field: "state", value: status, operator: "=" });
  }

  const requestDTO = {
    page: page,
    size: 20,
    sortDirection: "ASC",
    sortBy: "id",
    filters: filters,
  };

  try {
    const response = await fetch('http://localhost:8080/parking-zones/get/all/pag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestDTO),
    });

    if (response.ok) {
      const data = await response.json();

      // фильтруем по managerId из localStorage
      const managerId = localStorage.getItem('userId');

      const filteredZones = data.content.filter(zone => 
        zone.zoneManager?.id?.toString() === managerId
      );

      setParkingZones(filteredZones);

      // При фильтрации вручную страницы лучше считать под себя,
      // либо сделать пагинацию на фронте
      setTotalPages(1);

    } else {
      console.error("Ошибка при загрузке данных");
    }
  } catch (error) {
    setParkingZones(fallbackParkingZones);
    console.error("Ошибка при подключении к серверу", error);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchParkingZones(currentPage, statusFilter, managerId);
  }, [currentPage, statusFilter, managerId]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Активно';
      case 'INACTIVE': return 'Неактивно';
      case 'PENDING': return 'Ожидает';
      default: return 'Неизвестно';
    }
  };

  const handleChangeState = async (zoneId, newState) => {
    try {
      const response = await fetch(`http://localhost:8080/parking-zones/update/state/${zoneId}?newStatus=${newState}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchParkingZones(currentPage, statusFilter, managerId);
      } else {
        console.error("Ошибка при обновлении статуса зоны");
      }
    } catch (error) {
      console.error("Ошибка при подключении к серверу", error);
    }
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">Парковочные зоны (Manager)</h1>
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
                    <th>Адрес</th>
                    <th>Менеджер зоны</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {parkingZones.map((zone) => (
                    <tr key={zone.id} onClick={() => handleZoneClick(zone)} style={{ cursor: 'pointer' }}>
                      <td>{zone.id}</td>
                      <td>{zone.title}</td>
                      <td>{zone.address}</td>
                      <td>{zone.zoneManager?.email || ""}</td>
                      <td>{getStatusLabel(zone.state)}</td>
                      <td className='actionFlex' onClick={e => e.stopPropagation()}>
                        {zone.state === 'ACTIVE' ? (
                          <button className="action-button" onClick={() => handleChangeState(zone.id, 'INACTIVE')}>
                            Сделать неактивной
                          </button>
                        ) : zone.state === 'INACTIVE' ? (
                          <button className="action-button" onClick={() => handleChangeState(zone.id, 'ACTIVE')}>
                            Сделать активной
                          </button>
                        ) : null}
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

      {showModal && selectedZone && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Парковочная зона #{selectedZone.id}</h2>

            <div className="modal-details">
              <p><strong>Зона:</strong> {selectedZone.title}</p>
              <p><strong>Адрес:</strong> {selectedZone.address}</p>
              <p><strong>Менеджер:</strong> {selectedZone.zoneManager?.email}</p>
              <p><strong>Статус:</strong> {getStatusLabel(selectedZone.state)}</p>
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

export default ZMParkingZones;
