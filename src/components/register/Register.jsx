import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../css/registerStyle.css';
import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';

const Register = () => {
    let {setheaderState} = useContext(HeaderContext);
    let {setUser} = useContext(UserContext);

    function register(){
        setheaderState("client")
        setUser("client")
    }

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Регистрация</h1>
        <form className="registerForm">
          <div className="formGroup">
            <label htmlFor="login" className="formLabel">Логин</label>
            <input type="text" id="login" className="formInput" />
          </div>
          <div className="formGroup">
            <label htmlFor="password" className="formLabel">Пароль</label>
            <input type="password" id="password" className="formInput" />
          </div>
          <div className="formGroup">
            <label htmlFor="confirmPassword" className="formLabel">Повторите пароль</label>
            <input type="password" id="confirmPassword" className="formInput" />
          </div>
          <div className="formGroup">
            <label htmlFor="phone" className="formLabel">Телефон</label>
            <input type="tel" id="phone" className="formInput" />
          </div>
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">Email</label>
            <input type="email" id="email" className="formInput" />
          </div>
          <Link to="/client/" className="submitButton">Зарегистрироваться</Link>
        </form>
        <p className="loginPrompt">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="loginLink" onClick={register()}>Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
