import "./index.css";

function NavbarVoltar() {
  const voltar = () => {
    window.history.back();
  };

  return (
    <nav className="navbar">
      <button className="navbar-btn" onClick={voltar} aria-label="Voltar">
        ←
      </button>
    </nav>
  );
}

export default NavbarVoltar;
