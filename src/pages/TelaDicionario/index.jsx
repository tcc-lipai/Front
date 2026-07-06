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

  const cardsData = Array(8).fill({
    titulo: "Laranja",
    descricao: "blabla fawdwadw",
  });

  return (
    <div className="tela-dicionario">
      {/* Navbar solta exatamente como na loja */}
      <Navbar /> 

      <main className="tela-dicionario__conteudo">
        {/* Topo com ações alinhadas à direita */}
        <div className="tela-dicionario__topo">
          <HeaderActions onOpenProfile={handleOpenProfile} />
        </div>

        {/* Painel Central Branco */}
        <section className="tela-dicionario__painel">
          <h1 className="tela-dicionario__titulo">Dicionário</h1>
          <p className="tela-dicionario__descricao">
            Explicação do que é o dicionário e como isso pode ajudar no ensino nlnald dwa f wafw afw
          </p>

          {/* Filtros organizados */}
          <div className="tela-dicionario__filtros">
            {categorias.map((cat) => {
              const isActive = categoriaAtiva === cat;
              return (
                <Botao
                  key={cat}
                  texto={cat}
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`btn-filter ${isActive ? "btn-active" : "btn-inactive"}`}
                  corFundo={isActive ? "#9c8cb9" : "transparent"}
                  corTexto={isActive ? "#ffffff" : "#4a1565"}
                  corBorda="#4a1565"
                />
              );
            })}
          </div>

          {/* Grade de Cards Responsiva */}
          <div className="tela-dicionario__grid">
            {cardsData.map((card, index) => (
              <div className="tela-dicionario__grid-item" key={index}>
                <DicionarioCard
                  titulo={card.titulo}
                  descricao={card.descricao}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TelaDicionario;