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
      {/* Botão hambúrguer: só fica visível em telas pequenas (ver index.css) */}
      <button
        type="button"
        className="navbar-hamburguer"
        onClick={abrirDrawer}
        aria-label="Abrir menu de navegação"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar normal: some em telas pequenas (ver index.css) */}
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