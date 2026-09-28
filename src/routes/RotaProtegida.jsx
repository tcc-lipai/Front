import { Navigate } from "react-router-dom";

/**
 * Só deixa passar quem tem token salvo (logado). Sem token, manda pra landing page.
 * Se `papeis` for passado, também exige que o `role` salvo no login esteja nessa lista
 * (ex.: telas de Admin não podem ser abertas só por estar logado como Usuario/Profissional).
 */
function RotaProtegida({ children, papeis }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (papeis && papeis.length > 0) {
    const role = localStorage.getItem("role");
    if (!papeis.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default RotaProtegida;
