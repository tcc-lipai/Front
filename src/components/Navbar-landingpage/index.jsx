import './index.css';
import { Link } from "react-router-dom";


const NavbarLandingPage = () => {
  return (
    <nav className="navbar-lp">
      <a href="#home" className="navbar-lp__logo">
        Lip<span>AI</span>
      </a>

      <ul className="navbar-lp__links">
        <li><a href="#home">Home</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#participantes">Equipe</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>

      <div className="navbar-lp__actions">
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
    </nav>
  );
};

export default NavbarLandingPage;
