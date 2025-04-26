import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerRegister } from '../../contexts/OwnerRegisterContext';
import '../../css/registerStyle.css';

const OwnerRegisterStep1 = () => {
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { updateRegisterData } = useOwnerRegister();

  const register = async () => {
    if (passwordInput !== confirmPasswordInput) {
      setError('Пароли не совпадают');
      return;
    }

    updateRegisterData({
      password: passwordInput,
      email: emailInput,
    });

    navigate('/register/ownerStep2');
  };

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Регистрация владельца</h1>
        <form className="registerForm" onSubmit={(e) => e.preventDefault()}>
          <div className="formGroup">
            <label htmlFor="password" className="formLabel">Пароль</label>
            <input
              type="password"
              id="password"
              className="formInput"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="confirmPassword" className="formLabel">Повторите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              className="formInput"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">Email</label>
            <input
              type="email"
              id="email"
              className="formInput"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button
            type="button"
            className="submitButton"
            onClick={register}
          >
            Перейти ко второму шагу
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerRegisterStep1;
