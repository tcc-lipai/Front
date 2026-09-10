import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const TelaNotificacoes = () => {
  const [filtro, setFiltro] = useState("lidas");
  const navigate = useNavigate();

  const notificacoesHoje = [
    {
      id: 1,
      titulo: "Sua Ofensiva 1",
      mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd",
      lida: false,
    },
    {
      id: 2,
      titulo: "Sua Ofensiva 2",
      mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd",
      lida: true,
    },
  ];

  const notificacoesUltimoMes = [
    {
      id: 3,
      titulo: "Sua Ofensiva 3",
      mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd",
      lida: true,
    },
    {
      id: 4,
      titulo: "Sua Ofensiva 4",
      mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd",
      lida: false,
    },
    {
      id: 5,
      titulo: "Sua Ofensiva 5",
      mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd",
      lida: true,
    },
  ];

  const isLida = filtro === "lidas";

  const notificacoesHojeFiltradas = notificacoesHoje.filter((notif) => notif.lida === isLida);
  const notificacoesMesFiltradas = notificacoesUltimoMes.filter((notif) => notif.lida === isLida);

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

        <section className="secao-notificacoes">
          <h2>Hoje</h2>
          <div className="lista-cards">
            {notificacoesHojeFiltradas.map((notif) => (
              <div key={notif.id} className="card-notificacao">
                <div className="icone-calendario">
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
                </div>
                <div className="texto-notificacao">
                  <h3>{notif.titulo}</h3>
                  <p>{notif.mensagem}</p>
                </div>
                {!notif.lida && <span className="ponto-nao-lida"></span>}
              </div>
            ))}
            {notificacoesHojeFiltradas.length === 0 && (
              <p style={{ color: "#666", marginTop: "10px" }}>Nenhuma notificação {filtro} hoje.</p>
            )}
          </div>
        </section>

        <section className="secao-notificacoes">
          <h2>Último mês</h2>
          <div className="lista-cards">
            {notificacoesMesFiltradas.map((notif) => (
              <div key={notif.id} className="card-notificacao">
                <div className="icone-calendario">
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
                </div>
                <div className="texto-notificacao">
                  <h3>{notif.titulo}</h3>
                  <p>{notif.mensagem}</p>
                </div>
                {!notif.lida && <span className="ponto-nao-lida"></span>}
              </div>
            ))}
            {notificacoesMesFiltradas.length === 0 && (
              <p style={{ color: "#666", marginTop: "10px" }}>
                Nenhuma notificação {filtro} neste mês.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TelaNotificacoes;
