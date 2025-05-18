import React from "react";
import { NavLink } from "react-router-dom";

const HeaderGuest = () => {
  return (
    <header className="header headerGuest">
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              ГЛАВНАЯ
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/parking"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              ПАРКОВКИ
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/takePart"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              УЧАСТВОВАТЬ В ПРОГРАММЕ
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contacts"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              КОНТАКТЫ
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderGuest;
