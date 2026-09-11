import { useNavigate } from "react-router-dom";
import "./index.css";
import { useTelaNotificacoes } from "./index.hook";

const IconeCalendario = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8A46A8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <polyline points="10 14 12 16 16 12"></polyline>
  </svg>
);

const ListaNotificacoes = ({ notificacoes, filtro, vazioTexto, onClicar }) => (
  <div className="lista-cards">
    {notificacoes.map((notificacao) => (
      <button
        key={notificacao.id}
        type="button"
        className="card-notificacao"
        onClick={() => onClicar(notificacao.id)}
      >
        <div className="icone-calendario">
          <IconeCalendario />
        </div>
        <div className="texto-notificacao">
          <p>{notificacao.descricao}</p>
        </div>
        {!notificacao.lida && <span className="ponto-nao-lida"></span>}
      </button>
    ))}
    {notificacoes.length === 0 && (
      <p style={{ color: "#666", marginTop: "10px" }}>
        Nenhuma notificação {filtro} {vazioTexto}.
      </p>
    )}
  </div>
);

const TelaNotificacoes = () => {
  const navigate = useNavigate();
  const { carregando, erro, filtro, setFiltro, hoje, ultimoMes, marcarComoLida } =
    useTelaNotificacoes();

  const filtroLabel = filtro === "lidas" ? "lida" : "não lida";

  const handleClicar = (id) => {
    if (filtro === "nao-lidas") marcarComoLida(id);
  };

  return (
    <div className="container-notificacoes">
      <header className="header-notificacoes">
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </header>

      <main className="conteudo-principal">
        <div className="container-filtros">
          <button
            className={`btn-filtro ${filtro === "nao-lidas" ? "ativo" : ""}`}
            onClick={() => setFiltro("nao-lidas")}
          >
            Não lidas
          </button>
          <button
            className={`btn-filtro ${filtro === "lidas" ? "ativo" : ""}`}
            onClick={() => setFiltro("lidas")}
          >
            Lidas
          </button>
        </div>

        {carregando && <p style={{ marginTop: 16 }}>Carregando...</p>}
        {!carregando && erro && <p style={{ marginTop: 16 }}>{erro}</p>}

        {!carregando && !erro && (
          <>
            <section className="secao-notificacoes">
              <h2>Hoje</h2>
              <ListaNotificacoes
                notificacoes={hoje}
                filtro={filtroLabel}
                vazioTexto="hoje"
                onClicar={handleClicar}
              />
            </section>

            <section className="secao-notificacoes">
              <h2>Anteriores</h2>
              <ListaNotificacoes
                notificacoes={ultimoMes}
                filtro={filtroLabel}
                vazioTexto="no período"
                onClicar={handleClicar}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default TelaNotificacoes;
