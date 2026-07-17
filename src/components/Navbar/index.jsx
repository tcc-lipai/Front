import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { NAV_ITEMS } from './index.types';
import { useNavbar } from './index.hook';
import { NavbarDrawer } from '../NavbarDrawer';
import './index.css';

const Navbar = () => {
  const { drawerAberto, abrirDrawer, fecharDrawer } = useNavbar();

  return (
    <>
      <button
        type="button"
        className="navbar-hamburguer"
        onClick={abrirDrawer}
        aria-label="Abrir menu de navegação"
      >
        <Menu size={24} />
      </button>

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

      <NavbarDrawer isOpen={drawerAberto} onClose={fecharDrawer} />
    </>
  );
};

export default Navbar;