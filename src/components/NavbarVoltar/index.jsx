import { useNavigate } from "react-router-dom";
import "./index.css";

function NavbarVoltar({ destino }) {
  const navigate = useNavigate();

  const voltar = () => {
    if (destino) {
      navigate(destino);
    } else {
      window.history.back();
    }
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
