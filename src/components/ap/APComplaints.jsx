import React, { useState, useEffect } from 'react';
import '../../css/adminDashboard.css';

const APComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchComplaints = async (page, status) => {
    setLoading(true);
    const requestDTO = {
      page,
      size: 10,
      sortDirection: "DESC",
      sortBy: "createdAt",
      filters: status !== 'ALL' ? [{ field: "status", value: status, operator: "=" }] : []
    };

    try {
      const response = await fetch('http://localhost:8080/complaint/get/all/pag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestDTO),
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data.content);
        setTotalPages(data.totalPages);
      } else {
        console.error("Ошибка при загрузке жалоб");
      }
    } catch (error) {
      console.error("Ошибка подключения", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Ожидает';
      case 'RESOLVED': return 'Решено';
      case 'REJECTED': return 'Отклонено';
      case 'PAYING': return 'Возврат средств';
      default: return 'Неизвестно';
    }
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/complaint/update/status?id=${id}&newStatus=${newStatus}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setComplaints(prev =>
          prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
        );
      } else {
        console.error('Не удалось обновить статус');
      }
    } catch (error) {
      console.error('Ошибка обновления', error);
    }
  };

  // Обработчик возврата денег - меняет статус на PAYING
  const handleRefund = async (id) => {
    await handleStatusChange(id, 'PAYING');
  };

  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">Жалобы</h1>
        <div className="filters-container">
          <div className="filter">
            <label htmlFor="statusFilter">Статус:</label>
            <select 
              id="statusFilter" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Все</option>
              <option value="PENDING">Ожидает</option>
              <option value="RESOLVED">Решено</option>
              <option value="REJECTED">Отклонено</option>
              <option value="PAYING">Возврат средств</option>
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
                    <th>Обвинитель</th>
                    <th>Обвиняемый</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(complaint => (
                    <tr key={complaint.id} onClick={() => handleComplaintClick(complaint)} style={{ cursor: 'pointer' }}>
                      <td>{complaint.id}</td>
                      <td>{complaint.complainant?.email}</td>
                      <td>{complaint.accused?.email}</td>
                      <td>{getStatusLabel(complaint.status)}</td>
                      <td>{new Date(complaint.createdAt).toLocaleString()}</td>
                      <td className='actionFlex' onClick={e => e.stopPropagation()}>
                        {complaint.status === 'PENDING' && (
                          <>
                            <button className="action-button" onClick={() => handleStatusChange(complaint.id, 'RESOLVED')}>Решить</button>
                            <button className="action-button danger" onClick={() => handleStatusChange(complaint.id, 'REJECTED')}>Отклонить</button>
                          </>
                        )}
                        {complaint.status === 'RESOLVED' && (
                          <button className="action-button refund" onClick={() => handleRefund(complaint.id)}>Вернуть деньги клиенту</button>
                        )}
                        {complaint.status === 'PAYING' && (
                          <span style={{ color: '#e8a317', fontWeight: 'bold' }}>Возврат средств в процессе...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Назад</button>
              <span>Страница {currentPage} из {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Вперед</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedComplaint && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Жалоба #{selectedComplaint.id}</h2>
            <p><strong>Жалобщик:</strong> {selectedComplaint.complainant?.email}</p>
            <p><strong>Обвиняемый:</strong> {selectedComplaint.accused?.email}</p>
            <p><strong>id брони:</strong> {selectedComplaint.bookingId}</p>
            <p><strong>Статус:</strong> {getStatusLabel(selectedComplaint.status)}</p>
            <p><strong>Дата создания:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
            <p><strong>Текст жалобы:</strong> {selectedComplaint.text || '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default APComplaints;
