import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RedesSociais from "../../components/RedesSociais";
import { HeaderActions } from "../../components/infoEstrelas";
import InfoAtividades from "../../components/InfoAtividades/InfoAtividades";
import Navbar from "../../components/Navbar";
import Bia from "../../assets/img/Bia.png";
import biaAcompanhante from "../../assets/img/biaAcompanhante.png";
import "./index.css";

const CARDS = [
  {
    id: 0,
    title: "Como Funciona?",
    text: "Bla ca c awd ad fesace xw bla ca c awd ad fesace xwadwaddwadadwa adwadddwadadwa",
  },
  {
    id: 1,
    title: "Por que ter um acompanhante é essencial?",
    text: "Bla ca c awd ad fesace xw bla ca c awd ad fesace xwadwaddwadadwa adwadddwadadwa",
  },
  {
    id: 2,
    title: "Como Funciona?",
    text: "Bla ca c awd ad fesace xw bla ca c awd ad fesace xwadwaddwadadwa adwadddwadadwa",
  },
];

const TelaAcompanhante = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();

  const total = CARDS.length;

  const getPosition = (cardId) => {
    const diff = (cardId - activeIndex + total) % total;
    if (diff === 0) return "center";
    if (diff === total - 1) return "left";
    return "right";
  };

  return (
    <div className="tela-acompanhante">

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Header com estrelas e dúvida ── */}
      <header className="ta-header">
        <HeaderActions />
      </header>

      {/* ── Banner Dicionário ── */}
      <section className="ta-dicionario">
        <div className="ta-dicionario__content">
          <h2 className="ta-dicionario__title">DIcionário</h2>
          <p className="ta-dicionario__text">
            Teste seus conhecimentos de leitura labial através de um dicionário. Veja quais sa dwa dw dwad w d wa
            dw wdadem ipsum doicing elperspiciatis dolorem veritatis ratione minus aspernatur pariatur officia distinctio praesentium minima unde, ipsam rerum ea. ugit sunt.
          </p>
          <button className="ta-dicionario__btn" onClick={() => navigate("/dicionario")}>Testar</button>
        </div>
        <div className="ta-dicionario__illustration">
          <img src={Bia} alt="Bia" />
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section className="ta-como-funciona">
        <div className="ta-como-funciona__illustration">
          <img src={biaAcompanhante} alt="Bia com acompanhante" />
        </div>
        <div className="ta-como-funciona__content">
          <h2 className="ta-como-funciona__title">Como Funciona?</h2>
          <p className="ta-como-funciona__text">
            Ladw adkwa dwadw fwa aqui vai explicar o que a parte do acompanhante
            é e para que serve e como utiliza-la vlakdwad wdwadwad dwadw d wa
            wwd wdwd adwaadf dwaddd dwadwa
          </p>
        </div>
      </section>

      {/* ── Carousel ── */}
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

      {/* ── Próximas Atividades ── */}
      <section className="ta-atividades">
        <h2 className="ta-atividades__title">Próximas atividades</h2>
        <div className="ta-atividades__grid">
          <InfoAtividades />
          <InfoAtividades />
          <InfoAtividades />
          <InfoAtividades />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="ta-footer">
        <RedesSociais />
      </footer>

    </div>
  );
};

export default TelaAcompanhante;