import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar, { NAV_ITENS_ADMIN } from "../../../components/Navbar";
import Botao from "../../../components/Botao";
import { useTheme } from "../../../hooks/useTheme";
import { logout } from "../../../services/authService";
import "../../../components/PainelListaUsuarios/index.css";
import "./index.css";

const TelaConfiguracoesAdmin = () => {
  const navigate = useNavigate();
  const { isDarkMode, setTheme } = useTheme();
  const [confirmarSaidaAberto, setConfirmarSaidaAberto] = useState(false);

  const confirmarLogout = () => {
    setConfirmarSaidaAberto(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="lista-usuarios">
      <aside className="lista-usuarios__sidebar">
        <Navbar itens={NAV_ITENS_ADMIN} />
      </aside>

      <main className="lista-usuarios__main">
        <header className="lista-usuarios__header">
          <h1 className="lista-usuarios__titulo">Configurações</h1>
        </header>

        <section className="config-admin-card">
          <div className="config-admin-card__info">
            <h2 className="config-admin-card__titulo">Modo de cor</h2>
            <p className="config-admin-card__descricao">
              Ative o tema escuro para reduzir o cansaço visual em ambientes de baixa luminosidade.
            </p>
          </div>
          <label className="config-admin-switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
              aria-label="Ativar modo escuro"
            />
            <span className="config-admin-switch__trilho" />
          </label>
        </section>

        <section className="config-admin-card">
          <div className="config-admin-card__info">
            <h2 className="config-admin-card__titulo">Sair da conta</h2>
            <p className="config-admin-card__descricao">
              Encerre sua sessão de administrador neste dispositivo. Você precisará fazer login
              novamente para acessar o painel.
            </p>
          </div>
          <Botao texto="Sair" variante="perigo" onClick={() => setConfirmarSaidaAberto(true)} />
        </section>
      </main>

      {confirmarSaidaAberto && (
        <div className="modal-overlay" onClick={() => setConfirmarSaidaAberto(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-x"
              onClick={() => setConfirmarSaidaAberto(false)}
              aria-label="Fechar"
            >
              &times;
            </button>
            <h2 className="modal-title">Deseja realmente sair?</h2>
            <p className="config-admin-card__descricao" style={{ textAlign: "center" }}>
              Você será desconectado da sua conta neste dispositivo e precisará fazer login
              novamente para continuar.
            </p>
            <div className="modal-actions">
              <Botao texto="Sim, sair" variante="perigo" onClick={confirmarLogout} />
              <Botao
                texto="Cancelar"
                variante="secundario"
                onClick={() => setConfirmarSaidaAberto(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelaConfiguracoesAdmin;
