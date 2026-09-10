import React from "react";
import { DicionarioCard } from "../../components/Dicionario";
import Navbar from "../../components/Navbar";
import { HeaderActions } from "../../components/HeaderActions";
import Botao from "../../components/Botao";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";
import "./index.css";

import { useTelaDicionario } from "./index.hook";

import backgroundOnda from "../../assets/img/background_onda.png";

const TelaDicionario = () => {
  const {
    categoriaAtiva,
    setCategoriaAtiva,
    cardsFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
  } = useTelaDicionario();

  const categorias = ["Comida", "Escola", "Trabalho", "Natureza", "Saudações"];

  return (
    <div className="tela-dicionario" style={{ backgroundImage: `url(${backgroundOnda})` }}>
      <Navbar />

      <main className="tela-dicionario__conteudo">
        <div className="tela-dicionario__topo">
          <HeaderActions onOpenProfile={abrirPerfil} />
        </div>

        <section className="tela-dicionario__painel">
          <h1 className="tela-dicionario__titulo">Dicionário</h1>
          <p className="tela-dicionario__descricao">
            Aprenda a leitura labial de diferentes palavras com vídeos demonstrativos.
          </p>

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

          <div className="tela-dicionario__grid">
            {cardsFiltrados.map((card) => (
              <div className="tela-dicionario__grid-item" key={card.id}>
                <DicionarioCard titulo={card.titulo} descricao={card.descricao} />
              </div>
            ))}

            {cardsFiltrados.length === 0 && (
              <p className="tela-dicionario__vazio">
                Nenhum card encontrado para a categoria "{categoriaAtiva}".
              </p>
            )}
          </div>
        </section>
      </main>

      <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />
    </div>
  );
};

export default TelaDicionario;
