import React from "react";
import { NavLink } from "react-router-dom";

const HeaderClient = () => {
  return (
    <header className="header headerGuest">
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/client" 
              end
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              ПАРКОВКИ
          </NavLink>
          </li>
          <li>
            <NavLink 
              to="/client/myBookings" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              МОИ БРОНИ
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/client/owners" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              ПРОФИЛЬ
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/client/contacts" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              ЧАТЫ
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderClient;
