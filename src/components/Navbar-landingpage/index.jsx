import './index.css';

const NavbarLandingPage = () => {
  return (
    <nav className="navbar-lp">
      <a href="#home" className="navbar-lp__logo">
        Lip<span>AI</span>
      </a>

      <ul className="navbar-lp__links">
        <li><a href="#home">Home</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#participantes">Participantes</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>

      <div className="navbar-lp__actions">
        <button className="navbar-lp__btn-cadastrar">Cadastrar</button>
        <button className="navbar-lp__btn-login">Login</button>
      </div>
    </nav>
  );
};

export default NavbarLandingPage;
