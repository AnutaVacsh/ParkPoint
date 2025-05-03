import React, { useContext, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
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
  const navigate = useNavigate ();

  async function login() {
    try {
      const userData = await apiLogin(loginInput, passwordInput);
      localStorage.setItem("userId", userData.id);
      console.log(userData);
      setheaderState(userData.role);
      setUser(userData.role);
      navigate('/client');
    } catch (err) {
      setError('Ошибка авторизации');
      console.error('Login error:', err);
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
          {error && <p className="error">{error}</p>} {/* Отображаем ошибку при логине */}
          <button
            type="button"
            className="submitButton"
            onClick={login} // Вызываем функцию login при клике на кнопку
          >
            Войти
          </button>
        </form>
        <p className="registerPrompt">
          Нет аккаунта?{' '}
          <Link to="/chooseRolePage" className="registerLink">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
