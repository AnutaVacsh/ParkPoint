import React, { useState, useEffect } from 'react';
import '../../css/adminDashboard.css';
import { useNavigate } from 'react-router-dom';

// Моковые данные на случай ошибки
// import mockApplications from '../../dto/mock/MockApplications';

const ApplicationAP = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Функция для загрузки заявок с сервера
  const fetchApplications = async (page, statusFilter) => {
    setLoading(true);

    const requestDTO = {
      page: page,
      size: 10,
      sortDirection: "ASC",
      sortBy: "id",
      filters: statusFilter === 'ALL' ? [] : [
        { field: "status", value: statusFilter, operator: "=" }
      ]
    };

    try {
      const response = await fetch('http://localhost:8080/application/get/pag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestDTO),
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.content);
        setTotalPages(data.totalPages);
      } else {
        console.error("Ошибка при загрузке данных");
      }
    } catch (error) {
      // setApplications(mockApplications);
      console.error("Ошибка при подключении к серверу", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplications(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  // Человекочитаемые статусы
  const getStatusLabel = (status) => {
  switch (status) {
    case 'UNVIEWED':    return 'Непросмотрено';
    case 'VIEWED':      return 'Просмотрено';
    case 'IN_PROGRESS': return 'В работе';
    case 'APPROVED':    return 'Подтверждено';
    case 'REJECTED':    return 'Отклонено';
    default:            return 'Неизвестно';
  }
};

  // Обработка клика по заявке — открытие модального окна с деталями
  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Обновление статуса заявки (пример для нескольких статусов)
  const handleStatusChange = async (id, currentStatus, action = null) => {
  let newState;

  if (currentStatus === 'IN_PROGRESS' && action === 'approve') {
      navigate(`/admin/add-parking-zone/${id}`);

      return;
    }

  switch(currentStatus) {
    case 'UNVIEWED':
      newState = 'VIEWED';
      break;
    case 'VIEWED':
      newState = 'IN_PROGRESS';
      break;
    case 'IN_PROGRESS':
      if (action === 'reject') newState = 'REJECTED';
      break;
    case 'APPROVED':
      newState = 'IN_PROGRESS';
      break;
    case 'REJECTED':
      newState = 'IN_PROGRESS';
      break;
    default:
      return;
  }

  if (!newState) return;

  try {
    const response = await fetch(`http://localhost:8080/application/update/state/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newState), // отправляем новый статус в теле
    });

    if (response.ok) {
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === id ? { ...app, status: newState } : app
        )
      );
      console.log(`Заявка ID ${id} обновлена до статуса: ${newState}`);
    } else {
      console.error('Ошибка при обновлении статуса');
    }
  } catch (error) {
    console.error('Ошибка при подключении к серверу', error);
  }
};

  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">Заявки</h1>
        <div className="filters-container">
          <div className="filter">
            <label htmlFor="statusFilter">Статус:</label>
            <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                >
                <option value="ALL">Все</option>
                <option value="UNVIEWED">Непросмотрено</option>
                <option value="VIEWED">Просмотрено</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="APPROVED">Подтверждено</option>
                <option value="REJECTED">Отклонено</option>
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
                    <th>Email</th>
                    <th>Тема</th>
                    <th>Адрес</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {applications && applications.map((app) => (
                    <tr key={app.id} onClick={() => handleApplicationClick(app)} style={{ cursor: 'pointer' }}>
                      <td>{app.id}</td>
                      <td>{app.email || 'Не указан'}</td>
                      <td>{app.title || '—'}</td>
                      <td>{app.address || '—'}</td>
                      <td>{getStatusLabel(app.status)}</td>
                      <td className='actionFlex' onClick={e => e.stopPropagation()}>
                        {app.status === 'UNVIEWED' && (
                            <button onClick={() => handleStatusChange(app.id, app.status)} className="action-button">
                            Пометить просмотренным
                            </button>
                        )}
                        {app.status === 'VIEWED' && (
                            <button onClick={() => handleStatusChange(app.id, app.status)} className="action-button">
                            Назначить в работу
                            </button>
                        )}
                        {app.status === 'IN_PROGRESS' && (
                            <>
                            <button onClick={() => handleStatusChange(app.id, app.status, 'approve')} className="action-button">
                                Создать зону
                            </button>
                            <button onClick={() => handleStatusChange(app.id, app.status, 'reject')} className="action-button">
                                Отклонить
                            </button>
                            </>
                        )}
                        {(app.status === 'APPROVED' || app.status === 'REJECTED') && (
                            <button onClick={() => handleStatusChange(app.id, app.status)} className="action-button">
                            Вернуть в работу
                            </button>
                        )}
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

      {showModal && selectedApplication && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Заявка #{selectedApplication.id}</h2>

            <div className="modal-details">
              <p><strong>Email:</strong> {selectedApplication.email || 'Не указан'}</p>
              <p><strong>Текст письма:</strong> {selectedApplication.emailText || '—'}</p>
              <p><strong>Тема:</strong> {selectedApplication.title || '—'}</p>
              <p><strong>Адрес:</strong> {selectedApplication.address || '—'}</p>
              <p><strong>Координаты:</strong> {selectedApplication.latitude}, {selectedApplication.longitude}</p>
              <p><strong>Описание:</strong> {selectedApplication.description || '—'}</p>
              <p><strong>Статус:</strong> {getStatusLabel(selectedApplication.status)}</p>
            </div>

            <div className="modal-actions">
              {/* Кнопки для действий (пример) */}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationAP;
