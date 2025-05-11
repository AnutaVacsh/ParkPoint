import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
  const { id } = useParams();

  useEffect(() => {
    // Здесь можно сделать fetch по ID, если понадобится
    console.log('User ID from URL:', id);
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Личный кабинет пользователя</h1>
      <p>ID пользователя: {id}</p>
      {/* Можно добавить fetch и отображение данных пользователя здесь */}
    </div>
  );
};

export default UserDashboard;
