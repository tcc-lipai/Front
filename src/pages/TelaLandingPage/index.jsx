import React from 'react';
import Footer from "../../components/Footer";
import './index.css';

const TelaLandingPage = () => {
  return (
    <div className="lp-wrapper">
      {/* Navbar */}
      <header className="lp-header">
        <div className="lp-logo">Lip<span>AI</span></div>
        <nav className="lp-nav">
          <a href="#home">HOME</a>
          <a href="#sobre">SOBRE</a>
          <a href="#participantes">PARTICIPANTES</a>
          <a href="#contato">CONTATO</a>
        </nav>
        <div className="lp-auth">
          <button className="lp-btn-cadastrar">Cadastrar</button>
          <button className="lp-btn-login">Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="lp-hero" id="home">
        <div className="lp-hero-info">
          <h1>LipAI</h1>
          <h2>Sistema de leitura labial e treinamento de voz</h2>
          <p>Potencialize sua comunicação com inteligência artificial.</p>
          <button className="lp-btn-cta">Acessar agora</button>
        </div>
        <div className="lp-hero-img">
          <div className="notebook-mockup"></div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section className="lp-about" id="sobre">
        <h2 className="lp-title">Sobre o LipAI</h2>
        <div className="lp-about-grid">
          <div className="lp-avatar-placeholder"></div>
          <div className="lp-benefits">
            <h3>Benefícios do nosso aprendizado online</h3>
            {[1, 2, 3].map((n) => (
              <div key={n} className="lp-benefit-card">
                <span className="lp-icon">🕒</span>
                <div>
                  <strong>Flexibilidade</strong>
                  <p>Aprenda no seu ritmo, em qualquer lugar.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Participantes */}
      <section className="lp-team" id="participantes">
        <h2 className="lp-title">Membros da Equipe:</h2>
        <div className="lp-team-grid">
          {[1, 2, 3, 4, 5].map((m) => (
            <div key={m} className="lp-member-card">
              <div className="lp-member-photo"></div>
              <strong>Angela Ivon</strong>
              <p>Backend e Frontend</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário de Contato */}
      <section className="lp-contact" id="contato">
        <h2 className="lp-title">Contato:</h2>
        <form className="lp-form">
          <input type="text" placeholder="Nome" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Assunto" rows="4"></textarea>
          <button type="submit" className="lp-btn-submit">Enviar</button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default TelaLandingPage;