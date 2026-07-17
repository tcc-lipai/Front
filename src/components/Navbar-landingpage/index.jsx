import { useState } from "react";
import './index.css';
import { Link } from "react-router-dom";

const NavbarLandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar-lp">
      <a href="#home" className="navbar-lp__logo">
        Lip<span>AI</span>
      </a>

      <ul className={`navbar-lp__links ${menuOpen ? "navbar-lp__links--open" : ""}`}>
        <li><a href="#home" onClick={closeMenu}>Home</a></li>
        <li><a href="#sobre" onClick={closeMenu}>Sobre</a></li>
        <li><a href="#participantes" onClick={closeMenu}>Equipe</a></li>
        <li><a href="#contato" onClick={closeMenu}>Contato</a></li>

        <li className="navbar-lp__actions navbar-lp__actions--mobile">
          <Link to="/criar-conta" onClick={closeMenu}>
            <button className="navbar-lp__btn-cadastrar">Cadastrar</button>
          </Link>
          <Link to="/login" onClick={closeMenu}>
            <button className="navbar-lp__btn-login">Login</button>
          </Link>
        </li>
      </ul>

      <div className="navbar-lp__actions navbar-lp__actions--desktop">
        <Link to="/criar-conta">
          <button className="navbar-lp__btn-cadastrar">
            Cadastrar
          </button>
        </Link>

        <Link to="/login">
          <button className="navbar-lp__btn-login">
            Login
          </button>
        </Link>
      </div>

      <button
        className={`navbar-lp__hamburger ${menuOpen ? "is-active" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {menuOpen && <div className="navbar-lp__overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default NavbarLandingPage;