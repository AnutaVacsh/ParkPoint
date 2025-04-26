import React from "react";
import { Link } from "react-router-dom";
// import "./HeaderGuest.css"; // Подключение стилей

const HeaderClient = () => {
  return (
    <header className="header headerGuest">
      <nav className="nav">
      <ul className="nav-links">
          <li><Link to="/client">ПАРКОВКИ</Link></li>
          <li><Link to="/client/myBookings">МОИ БРОНИ</Link></li>
          <li><Link to="/client/owners">ПРОФИЛЬ</Link></li>
          <li><Link to="/client/contacts">ЧАТЫ</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderClient;