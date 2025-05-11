import React, { useState, useEffect } from 'react';
import '../../css/adminDashboard.css'; 

const Role = {
  CLIENT: 'CLIENT',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  ZONE_MANAGER: 'ZONE_MANAGER',
};

const APUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ALL'); 

  const fetchUsers = async (page) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/user/get/all/pag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          size: 10,
          sortBy: 'id',
          sortDirection: 'ASC',
          filters: [
            { field: 'role', value: selectedRole === 'ALL' ? null : selectedRole, operator: '=' },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить данные пользователей');
      }

      const data = await response.json();

      setUsers(data.content);  
      setTotalPages(data.totalPages); 
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователей:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, selectedRole]);

  useEffect(() => {
    if (selectedRole === 'ALL') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selectedRole));
    }
  }, [users, selectedRole]);

  const getRoleLabel = (role) => {
    switch (role) {
      case Role.ADMIN: return 'Админ';
      case Role.CLIENT: return 'Клиент';
      case Role.OWNER: return 'Владелец';
      case Role.ZONE_MANAGER: return 'Менеджер зоны';
      default: return 'Неизвестная роль';
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">Пользователи</h1>
        <div className="filter">
          <label>Фильтровать по роли:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="ALL">Все</option>
            <option value={Role.ADMIN}>Админ</option>
            <option value={Role.USER}>Пользователь</option>
            <option value={Role.CLIENT}>Клиент</option>
            <option value={Role.OWNER}>Владелец</option>
            <option value={Role.ZONE_MANAGER}>Менеджер зоны</option>
          </select>
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
                    <th>Роль</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{getRoleLabel(user.role)}</td>
                      <td className='actionFlex' onClick={(e) => e.stopPropagation()}>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Назад
              </button>
              <span>Страница {currentPage} из {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Вперед
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Пользователь #{selectedUser.id}</h2>

            <div className="modal-details">
              <p><strong>Email:</strong> <a href={`/user/dashboard/${selectedUser.id}`} className="email-link">{selectedUser.email}</a></p>
              <p><strong>Роль:</strong> {getRoleLabel(selectedUser.role)}</p>
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

export default APUsers;
