import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/registerStyle.css';
import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';
import { register as apiRegister } from '../../api/AuthApi';

const OwnerRegisterStep1 = () => {
  const { setheaderState } = useContext(HeaderContext);
  const { setUser } = useContext(UserContext);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function register() {
    if (passwordInput !== confirmPasswordInput) {
      setError('Пароли не совпадают');
      return;
    }

    const registerRequest = {
      password: passwordInput,
      phone: phoneInput,
      email: emailInput,
    };

    try {
      const result = await apiRegister(registerRequest);
      localStorage.setItem("userId", result.id);
      console.log(result)
      localStorage.setItem("role", result.role)
      setheaderState(result.role);
      setUser(result.role);
      navigate('/client');
    } catch (err) {
      setError('Ошибка регистрации');
      console.error('Registration error:', err);
    }
  }

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Регистрация</h1>
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
            <label htmlFor="phone" className="formLabel">Телефон</label>
            <input
              type="tel"
              id="phone"
              className="formInput"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
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
            onClick={register} // Вызываем функцию register при клике на кнопку
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="loginPrompt">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="loginLink">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default OwnerRegisterStep1;
