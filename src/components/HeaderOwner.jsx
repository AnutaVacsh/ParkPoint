import React from "react";
import { NavLink } from "react-router-dom";

const HeaderOwner = () => {
  return (
    <header className="header headerGuest">
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/owner" 
              end
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              ПАРКОВКИ
          </NavLink>
          </li>
          <li>
            <NavLink 
              to="/owner/myBookings" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              МОИ БРОНИ
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/owner/profile" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              ПРОФИЛЬ
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/chat/0" 
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

export default HeaderOwner;
