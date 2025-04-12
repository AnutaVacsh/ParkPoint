import React from "react";
import { Link } from "react-router-dom";
// import "./HeaderGuest.css"; // Подключение стилей

const HeaderGuest = () => {
  return (
    <header className="header headerGuest">
      <nav className="nav">
      <ul className="nav-links">
          <li><Link to="/">ГЛАВНАЯ</Link></li>
          <li><Link to="/parking">ПАРКОВКИ</Link></li>
          <li><Link to="/owners">ДЛЯ ВЛАДЕЛЬЦЕВ</Link></li>
          <li><Link to="/contacts">КОНТАКТЫ</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderGuest;
