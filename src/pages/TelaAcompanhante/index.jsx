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

const BENEFICIOS = [
  {
    id: 0,
    titulo: "Como funciona?",
    texto:
      "O acompanhante permanece ao lado da criança durante os exercícios, oferecendo suporte e orientação para que ela consiga realizar as atividades com mais facilidade.",
  },
  {
    id: 1,
    titulo: "Por que ter um acompanhante é essencial?",
    texto:
      "O apoio do acompanhante ajuda a criança a compreender os exercícios, tornando o processo de aprendizagem mais seguro e interativo.",
  },
  {
    id: 2,
    titulo: "Auxílio durante as atividades",
    texto:
      "Por meio de estímulos e vibrações, o acompanhante ajuda a criança a perceber os comandos e desenvolver suas habilidades nos exercícios básicos.",
  },
];

const TelaAcompanhante = () => {
  const navigate = useNavigate();
  const { drawerAberto, abrirPerfil, fecharPerfil } = useTelaAcompanhante();
  const [ativo, setAtivo] = useState(0);

  const total = BENEFICIOS.length;

  const posicaoDoCard = (id) => {
    const diff = (id - ativo + total) % total;
    if (diff === 0) return "centro";
    if (diff === total - 1) return "esquerda";
    return "direita";
  };

  return (
    <div className="tela-acompanhante" style={{ backgroundImage: `url(${backgroundOnda})` }}>
      <Navbar />

      <header className="ta-header">
        <HeaderActions onOpenProfile={abrirPerfil} />
      </header>

      <section className="ta-dicionario">
        <div className="ta-dicionario__content">
          <h2 className="ta-dicionario__title">Acompanhante</h2>
          <p className="ta-dicionario__text">
            O acompanhante é um recurso pensado para apoiar a criança nos primeiros passos do
            aprendizado, ficando ao lado dela durante os exercícios e ajudando a entender cada
            comando por meio de estímulos visuais e vibrações.
          </p>
          <button className="ta-dicionario__btn" onClick={() => navigate("/atividades-unidades")}>
            Ver atividades
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

      <section className="ta-carrossel" aria-label="Por que ter um acompanhante">
        <div className="ta-carrossel-trilho">
          {BENEFICIOS.map((beneficio) => {
            const posicao = posicaoDoCard(beneficio.id);
            const estaNoCentro = posicao === "centro";

            return (
              <div
                key={beneficio.id}
                className={`ta-beneficio-card ta-beneficio-card--${posicao}`}
                onClick={() => !estaNoCentro && setAtivo(beneficio.id)}
                onKeyDown={(e) => {
                  if (!estaNoCentro && (e.key === "Enter" || e.key === " ")) {
                    setAtivo(beneficio.id);
                  }
                }}
                role={!estaNoCentro ? "button" : undefined}
                tabIndex={!estaNoCentro ? 0 : undefined}
                aria-label={!estaNoCentro ? `Ver: ${beneficio.titulo}` : undefined}
              >
                <h3>{beneficio.titulo}</h3>
                <p>{beneficio.texto}</p>
              </div>
            );
          })}
        </div>

        <div className="ta-carrossel-dots" role="tablist">
          {BENEFICIOS.map((beneficio) => (
            <button
              key={beneficio.id}
              className={`ta-carrossel-dot${ativo === beneficio.id ? " ta-carrossel-dot--ativo" : ""}`}
              onClick={() => setAtivo(beneficio.id)}
              role="tab"
              aria-selected={ativo === beneficio.id}
              aria-label={`Card ${beneficio.id + 1}`}
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
