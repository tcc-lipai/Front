import React from 'react';
import './index.css';
import Conquistas from '../../components/Conquistas/index.jsx';

const TelaConquistas = () => {
  const conquistasAtingidas = Array(7).fill({
    title: "Semana Ouro",
    subtitle: "Semana Ouro"
  });

  const conquistasNaoAtingidas = Array(14).fill({
    title: "Semana Ouro",
    subtitle: "Semana Ouro"
  });

  return (
    <div className="container-tela-conquistas">
      <header className="header-conquistas">
        <button className="btn-voltar-conquistas">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </header>

      <main className="box-conquistas">
        
        <section className="secao-grid-conquistas">
          <h2>Conquistas</h2>
          <div className="grid-cards-conquistas">
            {conquistasAtingidas.map((item, index) => (
              <div key={`atingida-${index}`}>
                <Conquistas title={item.title} subtitle={item.subtitle} />
              </div>
            ))}
          </div>
        </section>

        <section className="secao-grid-conquistas">
          <h2>Não atingidas</h2>
          <div className="grid-cards-conquistas bloco-nao-atingidas">
            {conquistasNaoAtingidas.map((item, index) => (
              <div key={`nao-atingida-${index}`}>
                <Conquistas title={item.title} subtitle={item.subtitle} />
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default TelaConquistas;