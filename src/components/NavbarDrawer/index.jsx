import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_ITEMS } from '../Navbar/index.types';
import { useNavbarDrawer } from './index.hook';
import './index.css';

export const NavbarDrawer = ({ isOpen, onClose }) => {
  useNavbarDrawer(isOpen, onClose);

  return (
    <>
      {isOpen && <div className="navbar-drawer-overlay" onClick={onClose} />}

      <nav className={`navbar-drawer ${isOpen ? 'open' : ''}`}>
        <div className="navbar-drawer-header">
          <span className="navbar-drawer-titulo">Menu</span>
          <button
            type="button"
            className="navbar-drawer-close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="navbar-drawer-itens">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `navbar-drawer-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="navbar-drawer-icon" size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};