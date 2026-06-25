
import React, { useState } from 'react';
import './index.css';

const TelaNotificacoes = () => {
  // Estado para controlar o filtro superior (Lidas / Não lidas)
  const [filtro, setFiltro] = useState('lidas');

  // Dados mockados simulando as notificações da imagem
  const notificacoesHoje = [
    { id: 1, titulo: "Sua Ofensiva", mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd", lida: false },
    { id: 2, titulo: "Sua Ofensiva", mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd", lida: true }
  ];

  const notificacoesUltimoMes = [
    { id: 3, titulo: "Sua Ofensiva", mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd", lida: true },
    { id: 4, titulo: "Sua Ofensiva", mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd", lida: true },
    { id: 5, titulo: "Sua Ofensiva", mensagem: "Não esqueça da sua ofensiva blal fvald dawdwawd", lida: true }
  ];

  return (
    <div className="container-notificacoes">
      {/* Cabeçalho Roxo */}
      <header className="header-notificacoes">
        <button className="btn-voltar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="conteudo-principal">
        {/* Filtros */}
        <div className="container-filtros">
          <button 
            className={`btn-filtro ${filtro === 'nao-lidas' ? 'ativo' : ''}`}
            onClick={() => setFiltro('nao-lidas')}
          >
            Não lidas
          </button>
          <button 
            className={`btn-filtro ${filtro === 'lidas' ? 'ativo' : ''}`}
            onClick={() => setFiltro('lidas')}
          >
            Lidas
          </button>
        </div>

        {/* Seção: Hoje */}
        <section className="secao-notificacoes">
          <h2>Hoje</h2>
          <div className="lista-cards">
            {notificacoesHoje.map((notif) => (
              <div key={notif.id} className="card-notificacao">
                <div className="icone-calendario">
                  {/* SVG do Calendário com Checkmark */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A46A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          </div>
        </section>

        {/* Seção: Último mês */}
        <section className="secao-notificacoes">
          <h2>Último mês</h2>
          <div className="lista-cards">
            {notificacoesUltimoMes.map((notif) => (
              <div key={notif.id} className="card-notificacao">
                <div className="icone-calendario">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A46A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TelaNotificacoes;