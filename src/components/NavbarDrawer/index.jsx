import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { NAV_ITENS_ALUNO } from "../Navbar/index.types";
import { useNavbarDrawer } from "./index.hook";
import "./index.css";

export const NavbarDrawer = ({ isOpen, onClose, itens = NAV_ITENS_ALUNO }) => {
  useNavbarDrawer(isOpen, onClose);

  return (
    <>
      {isOpen && <div className="navbar-drawer-overlay" onClick={onClose} />}

      <nav className={`navbar-drawer ${isOpen ? "open" : ""}`}>
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
          {itens.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `navbar-drawer-item ${isActive ? "active" : ""}`}
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
