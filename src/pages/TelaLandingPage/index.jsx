import React from "react";
import NavbarLandingPage from "../../components/Navbar-landingpage";
import Footer from "../../components/Footer";
import "./index.css";

import notebookImg from "../../assets/img/notebook-dashboard.png";
import biaImg from "../../assets/img/bia-landingpage.png";
import celularImg from "../../assets/img/celular-landingpage.png";
import membroImg from "../../assets/img/img-teste.png";

const membros = [
  { nome: "Angelo Ivon", cargo: "Back-end e Front-end" },
  { nome: "Arthur Gael Araújo Pinho de Almeida", cargo: "Back-end e Front-end" },
  { nome: "Evellyn dos Santos Furtado", cargo: "Back-end e Front-end" },
  { nome: "Gabriela Romano", cargo: "Back-end e Front-end" },
  { nome: "João Paulo Souza Azevedo", cargo: "Back-end e Front-end" },
];

const TelaLandingPage = () => {
  return (
    <div className="landing">
      {/* NAVBAR */}
      <NavbarLandingPage />

      {/* HERO + WAVE + FEATURES WRAPPER */}
      <div className="landing__hero-wrapper">
        {/* HERO */}
        <section className="landing__hero" id="home">
          <div className="landing__hero-text">
            <div className="landing__hero-logo">
              <span className="logo-lip">Lip</span>
              <span className="logo-ai">AI</span>
            </div>
            <p className="landing__hero-subtitle">
              Sistema de leitura labial e treinamento da voz
            </p>
            <p className="landing__hero-desc">
              Este projeto tem como objetivo auxiliar pessoas surdas ou
              surdo-mudas no desenvolvimento da comunicação por meio da
              tecnologia.
            </p>
            <button className="landing__hero-btn">Acessar aqui</button>
          </div>
          <div className="landing__hero-image">
            <img src={notebookImg} alt="Dashboard LipAI no notebook" />
          </div>
        </section>

        {/* ONDA ROXA */}
        <div className="landing__hero-wave">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path
              d="M0,80 C320,180 1120,0 1440,100 L1440,200 L0,200 Z"
              fill="#7A3A8E"
            />
          </svg>
        </div>

        {/* FEATURES */}
        <section className="landing__features">
          <div className="landing__feature-card">
            <div className="feature-icon"></div>
            <h3>Foco no Aprendizado</h3>
            <p>
              Lorem ipsum is simply dummy text of the printing and
              aaadaatypesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s.
            </p>
          </div>
          <div className="landing__feature-card">
            <div className="feature-icon"></div>
            <h3>Foco no Aprendizado</h3>
            <p>
              Lorem ipsum is simply dummy text of the printing and
              aaadaatypesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s.
            </p>
          </div>
          <div className="landing__features-wave">
            <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path
                d="M0,40 C360,140 1080,0 1440,80 L1440,150 L0,150 Z"
                fill="#ede3f6"
              />
            </svg>
          </div>
        </section>
      </div>

      {/* SOBRE */}
      <section className="landing__sobre" id="sobre">
        <div className="landing__sobre-bg"></div> {/* DIV DE FUNDO PARA O ROXO CLARO */}
        <h2>Sobre o LipAI</h2>
        <div className="landing__sobre-content">
          <div className="landing__sobre-image">
            <img src={biaImg} alt="Bia - Mascote LipAI" />
          </div>
          <div className="landing__sobre-benefits">
            <h3>
              <span>Benefícios</span> do nosso aprendizado online
            </h3>

            <div className="benefit-item">
              <div className="benefit-icon">🕐</div>
              <div>
                <h4>Flexibilidade</h4>
                <p>
                  Aprenda no seu próprio ritmo, a qualquer hora e em qualquer
                  lugar, com LipAI com sua agenda.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">🕐</div>
              <div>
                <h4>Flexibilidade</h4>
                <p>
                  Aprenda no seu próprio ritmo, a qualquer hora e em qualquer
                  lugar, com LipAI com sua agenda.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">🕐</div>
              <div>
                <h4>Flexibilidade</h4>
                <p>
                  Aprenda no seu próprio ritmo, a qualquer hora e em qualquer
                  lugar, com LipAI com sua agenda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing__cta">
        <div className="landing__cta-card">
          <div className="landing__cta-circle"></div>

          <div className="landing__cta-image">
            <img src={celularImg} alt="Celular LipAI" />
          </div>

          <div className="landing__cta-text">
            <h2>
              Preparado? Vamos começar com <span>LipAI</span><br />
              e ter uma experiência incrível!
            </h2>

            <p>
              Explore uma nova forma de comunicação com tecnologia acessível e
              intuitiva. Comece agora e evolua no seu ritmo.
            </p>

            <div className="landing__cta-buttons">
              <button className="landing__cta-btn">
                Saiba mais
              </button>
              <button className="landing__cta-btn-acessar">
                Acessar aqui
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      {/* EQUIPE */}
      <section className="equipe">
        <div className="equipe__container">

          <div className="equipe__header">
            <span>Desenvolvedores</span>
            <h2>
              Membros da <br /> Equipe:
            </h2>
          </div>

          <div className="equipe__grid">
            {membros.map((m, i) => (
              <div className="equipe__card" key={i}>
                <div className="equipe__card-inner">
                  <img src={membroImg} alt={m.nome} />
                  <h4>{m.nome}</h4>
                  <p>{m.cargo}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTATO */}
      <section className="landing__contato" id="contato">
        <div className="landing__contato-container">
          <h2>Contato:</h2>
          <form className="landing__contato-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" placeholder="Seu nome" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Seu e-mail" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="assunto">Assunto:</label>
              <textarea id="assunto" name="assunto" placeholder="Como podemos ajudar?" />
            </div>
            <div className="form-submit">
              <button type="submit">Enviar</button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TelaLandingPage;