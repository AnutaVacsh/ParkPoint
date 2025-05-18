import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/loginStyle.css';
import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';
import { login as apiLogin } from '../../api/AuthApi';

const Login = () => {
  const { setheaderState } = useContext(HeaderContext);
  const { setUser } = useContext(UserContext);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function login() {
    try {
      setError(null); // сброс предыдущей ошибки
      const userData = await apiLogin(loginInput, passwordInput);

      if (!userData?.role) {
        throw new Error("Нет роли в данных пользователя");
      }

      localStorage.setItem("userId", userData.id);
      localStorage.setItem("role", userData.role);
      setheaderState(userData.role);
      setUser(userData.role);

      if (userData.role === "CLIENT") {
        navigate('/client');
      } else if (userData.role === "OWNER") {
        navigate('/owner');
      } else if (userData.role === "ZONE_MANAGER") {
        navigate('/manager');
      } else {
        setError("Неизвестная роль");
      }

    } catch (err) {
      console.error('Login error:', err);

      if (err.response?.status === 500) {
        setError("Сервер недоступен. Попробуйте позже.");
      } else if (err.response?.status === 401) {
        setError("Неверный логин или пароль.");
      } else {
        setError("Ошибка авторизации");
      }
    }
  }

  return (
    <div className="loginPage">
      <div className="loginContent">
        <h1 className="loginTitle">Вход</h1>
        <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
          <div className="formGroup">
            <label htmlFor="login" className="formLabel">Логин</label>
            <input
              type="text"
              id="login"
              className="formInput"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              required
            />
          </div>
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
          {error && <p className="error">{error}</p>}
          <button
            type="button"
            className="submitButton"
            onClick={login}
          >
            Войти
          </button>
        </form>
        {localStorage.getItem('role') !== 'ZONE_MANAGER' && (
          <p className="registerPrompt">
            Нет аккаунта?{' '}
            <Link to="/chooseRolePage" className="registerLink">Зарегистрироваться</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
