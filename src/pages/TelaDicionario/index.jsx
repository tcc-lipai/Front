import React, { useState } from "react";
import { DicionarioCard } from "../../components/Dicionario";
import Navbar from "../../components/Navbar";
import { HeaderActions } from "../../components/infoEstrelas";
import Botao from "../../components/Botao";
import "./index.css";

const TelaDicionario = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Comida");

  const handleOpenProfile = () => {
    console.log("Abrindo o perfil do usuário...");
  };

  const categorias = ["Comida", "Escola", "Trabalho", "Natureza", "Saudações"];

  // Gerando os 8 cards exatamente como na referência
  const cardsData = Array(8).fill({
    titulo: "Laranja",
    descricao: "blabla fawdwadw",
  });

  return (
    <div className="tela-dicionario-layout">
      {/* Sidebar na esquerda */}
      <aside className="sidebar-container">
        <Navbar />
      </aside>

      {/* Conteúdo principal */}
      <div className="main-container">
        
        {/* Topo com os contadores alinhados à direita */}
        <header className="header-top">
          <HeaderActions onOpenProfile={handleOpenProfile} />
        </header>

        {/* Card Branco Central */}
        <main className="content-card">
          <h1 className="main-title">Dicionário</h1>
          <p className="main-subtitle">
            Explicação do que é o dicionário e como isso pode ajudar no ensino nlnald dwa f wafw afw
          </p>

          {/* Filtros organizados */}
          <section className="filters-container">
            {categorias.map((cat) => {
              const isActive = categoriaAtiva === cat;
              return (
                <Botao
                  key={cat}
                  texto={cat}
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`btn-filter ${isActive ? "btn-active" : "btn-inactive"}`}
                  // Enviando as propriedades de cores para o seu componente receber
                  corFundo={isActive ? "#9c8cb9" : "transparent"}
                  corTexto={isActive ? "#ffffff" : "#4a1565"}
                  corBorda="#4a1565"
                />
              );
            })}
          </section>

          {/* Grade de Cards perfeitamente alinhada e dimensionada */}
          <section className="cards-grid">
            {cardsData.map((card, index) => (
              <DicionarioCard
                key={index}
                titulo={card.titulo}
                descricao={card.descricao}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default TelaDicionario;