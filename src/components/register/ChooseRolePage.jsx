import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/registerStyle.css';

const ChooseRolePage = () => {
  return (
    <div className="registerPage">
      <div className="registerContent">
        <div className="registerForm">
          <Link to="/register/client" className="submitButton">Я клиент</Link>
          <Link to="/register/owner" className="submitButton">Я владелец</Link>
        </div>
        <div className="loginPrompt">
          Уже есть аккаунт? <Link to="/login" className="loginLink">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRolePage;