import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RedesSociais from "../../components/RedesSociais";
import { HeaderActions } from "../../components/HeaderActions";
import InfoAtividades from "../../components/InfoAtividades";
import Navbar from "../../components/Navbar";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";
import Bia from "../../assets/img/Bia.png";
import biaAcompanhante from "../../assets/img/biaAcompanhante.png";
import "./index.css";

import backgroundOnda from "../../assets/img/background_onda.png";

import { useTelaAcompanhante } from "./index.hook";
import Botao from "../../components/Botao";

const CARDS = [
  {
    id: 0,
    title: "Como funciona?",
    text: "O acompanhante permanece ao lado da criança durante os exercícios, oferecendo suporte e orientação para que ela consiga realizar as atividades com mais facilidade.",
  },
  {
    id: 1,
    title: "Por que ter um acompanhante é essencial?",
    text: "O apoio do acompanhante ajuda a criança a compreender os exercícios, tornando o processo de aprendizagem mais seguro e interativo.",
  },
  {
    id: 2,
    title: "Auxílio durante as atividades",
    text: "Por meio de estímulos e vibrações, o acompanhante ajuda a criança a perceber os comandos e desenvolver suas habilidades nos exercícios básicos.",
  },
];

const TelaAcompanhante = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();

  const { drawerAberto, abrirPerfil, fecharPerfil } = useTelaAcompanhante();

  const total = CARDS.length;

  const getPosition = (cardId) => {
    const diff = (cardId - activeIndex + total) % total;
    if (diff === 0) return "center";
    if (diff === total - 1) return "left";
    return "right";
  };

  return (
    <div className="tela-acompanhante" style={{ backgroundImage: `url(${backgroundOnda})` }}>
      <Navbar />

      <header className="ta-header">
        <HeaderActions onOpenProfile={abrirPerfil} />
      </header>

      <section className="ta-dicionario">
        <div className="ta-dicionario__content">
          <h2 className="ta-dicionario__title">Dicionário</h2>
          <p className="ta-dicionario__text">
            O dicionário da plataforma é uma ferramenta de apoio à leitura labial. Nele, você poderá
            pesquisar ou encontrar o nome de diferentes objetos e acessar um vídeo demonstrativo
            mostrando como realizar a leitura labial daquela palavra. Dessa forma, o recurso
            facilita o aprendizado e a prática da leitura labial de maneira visual e interativa.
          </p>
          <button className="ta-dicionario__btn" onClick={() => navigate("/dicionario")}>
            Testar
          </button>
        </div>
        <div className="ta-dicionario__illustration">
          <img src={Bia} alt="Bia" />
        </div>
      </section>

      <section className="ta-como-funciona">
        <div className="ta-como-funciona__illustration">
          <img src={biaAcompanhante} alt="Bia com acompanhante" />
        </div>
        <div className="ta-como-funciona__content">
          <h2 className="ta-como-funciona__title">Como Funciona?</h2>
          <p className="ta-como-funciona__text">
            O acompanhante é um recurso de apoio desenvolvido para auxiliar a criança durante os
            níveis iniciais da aprendizagem. Ele atua como um suporte durante os exercícios,
            acompanhando seus movimentos e oferecendo estímulos, como vibrações e orientações, para
            facilitar a compreensão dos comandos e a realização das tarefas. Dessa forma, a criança
            consegue desenvolver suas habilidades de forma mais segura, interativa e adaptada ao seu
            ritmo de aprendizado, contando com um auxílio extra durante as primeiras etapas da
            experiência.
          </p>
        </div>
      </section>

      <section className="ta-carousel" aria-label="Por que ter um acompanhante">
        <div className="ta-carousel__track">
          {CARDS.map((card) => {
            const pos = getPosition(card.id);
            const isCenter = pos === "center";

            return (
              <div
                key={card.id}
                className={`ta-carousel__card ta-carousel__card--${pos}`}
                onClick={() => !isCenter && setActiveIndex(card.id)}
                onKeyDown={(e) => {
                  if (!isCenter && (e.key === "Enter" || e.key === " ")) {
                    setActiveIndex(card.id);
                  }
                }}
                role={!isCenter ? "button" : undefined}
                tabIndex={!isCenter ? 0 : undefined}
                aria-label={!isCenter ? `Ver: ${card.title}` : undefined}
              >
                <h3 className="ta-carousel__card-title">{card.title}</h3>
                <p className="ta-carousel__card-text">{card.text}</p>
              </div>
            );
          })}
        </div>

        <div className="ta-carousel__dots" role="tablist">
          {CARDS.map((card) => (
            <button
              key={card.id}
              className={`ta-carousel__dot${activeIndex === card.id ? " ta-carousel__dot--active" : ""}`}
              onClick={() => setActiveIndex(card.id)}
              role="tab"
              aria-selected={activeIndex === card.id}
              aria-label={`Card ${card.id + 1}`}
            />
          ))}
        </div>
      </section>

      {/* <section className="ta-atividades">
        <h2 className="ta-atividades__title">Próximas atividades</h2>
        <div className="ta-atividades__grid">
          <InfoAtividades onAvancar={() => navigate("/atividade/acompanhante/1")} />
          <InfoAtividades onAvancar={() => navigate("/atividade/acompanhante/2")} />
          <InfoAtividades onAvancar={() => navigate("/atividade/acompanhante/3")} />
          <InfoAtividades onAvancar={() => navigate("/atividade/acompanhante/4")} />
        </div>
      </section> */}

      <section className="ta-ver-atividades">
        <div className="ta-ver-atividades__content">
          <span className="ta-ver-atividades__tag">Continue evoluindo</span>
          <h2 className="ta-ver-atividades__title">Pronto para praticar?</h2>
          <p className="ta-ver-atividades__text">
            Veja as próximas atividades disponíveis e continue avançando no seu aprendizado de
            leitura labial.
          </p>
          <Botao
            texto="Ver atividades"
            corDeFundo="#8b5fbf"
            corTexto="#ffffff"
            className="ta-ver-atividades__btn"
            onClick={() => navigate("/inicio-atividades")}
          />
        </div>
      </section>

      <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />
    </div>
  );
};

export default TelaAcompanhante;
