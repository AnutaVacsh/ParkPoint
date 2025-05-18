import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/adminDashboard.css';

import zoneIcon from '../../img/ap2.png';
import carIcon from '../../img/ap0.png';
import chatIcon from '../../img/chat.png';

const actions = [
  { label: 'Мои зоны', icon: zoneIcon, path: 'parking-zones' },
  { label: 'Парковочные места', icon: carIcon, path: 'parking-spaces' },
  { label: 'Чаты', icon: chatIcon, path: '/chat/0' },
];

const fallbackUser = { email: 'неизвестный пользователь' };

const ZoneManagerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(fallbackUser);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await fetch(`http://localhost:8080/user/info/${userId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          setUser(fallbackUser);
        }
      } catch (e) {
        setUser(fallbackUser);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <div className="top-banner">
        <h1 className="title">{user?.email}</h1>
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
  
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneManagerDashboard;
