import React from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate для переходов
import '../../css/adminDashboard.css';

import carIcon from '../../img/ap0.png';
import alertIcon from '../../img/ap1.png';
import zoneIcon from '../../img/ap2.png';
import userIcon from '../../img/ap3.png';
import Chart1 from './Chart1';
import Chart2 from './Chart2';

const actions = [
  { label: 'Парковочные места', icon: carIcon, path: 'parking-spaces' },
  { label: 'Жалобы', icon: alertIcon, path: 'complaints' },
  { label: 'Парковочные зоны', icon: zoneIcon, path: 'parking-zones' },
  { label: 'Пользователи', icon: userIcon, path: 'users' },
];

const AdminDashboard = () => {
  const navigate = useNavigate(); // Получаем функцию navigate

  const handleClick = (path) => {
    navigate(path); // Переход на соответствующую страницу при клике
  };

  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">Admin8557648</h1>
      </div>
      <div className="content">
        <div className="main">
          <div className="left-panel">
            {actions.map(({ label, icon, path }) => (
              <div
                className="action-button"
                key={label}
                onClick={() => handleClick(path)} 
              >
                <span className="label">{label}</span>
                <img src={icon} alt="" className="icon" />
              </div>
            ))}
          </div>
          <div className="right-panel">
            <Chart2 />
            <Chart1 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
