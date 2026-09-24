import { Navigate } from "react-router-dom";

/** Só deixa passar quem tem token salvo (logado). Sem token, manda pra landing page. */
function RotaProtegida({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaProtegida;
