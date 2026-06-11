import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './index.types';
import './index.css';

const Navbar = () => {
  return (
    <nav className="sidebar-navbar">
      <div className="navbar-container">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <Icon className="nav-icon" size={24} />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;