import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { NAV_ITENS_ALUNO } from "./index.types";
import { useNavbar } from "./index.hook";
import { NavbarDrawer } from "../NavbarDrawer";
import "./index.css";

export { NAV_ITENS_ALUNO, NAV_ITENS_PROFISSIONAL, NAV_ITENS_ADMIN } from "./index.types";

/**
 * Barra lateral de navegação. Serve aluno, profissional e admin —
 * basta trocar a lista `itens` (ver NAV_ITENS_* em ./index.types).
 */
const Navbar = ({ itens = NAV_ITENS_ALUNO }) => {
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
          {itens.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <Icon className="nav-icon" size={24} />
              </NavLink>
            );
          })}
        </div>
      </nav>

      <NavbarDrawer isOpen={drawerAberto} onClose={fecharDrawer} itens={itens} />
    </>
  );
};

export default Navbar;
