import React from 'react';
import './index.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        
        {/* Lado Esquerdo: Logo, Subtítulo e Menu com Linha */}
        <div className="footer__brand-col">
          <div className="footer__logo">Lip<span>AI</span></div>
          <p>Sistema de Leitura Labial e Treinamento da Fala</p>
          
          <nav className="footer__nav">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#equipe">Equipe</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </nav>
        </div>

        {/* Centro: Contatos */}
        <div className="footer__contact-col">
          <div className="footer__contact-item">
            <h4>Telefone:</h4>
            <p>+55 11 98585-8499</p>
          </div>
          <div className="footer__contact-item">
            <h4>Email:</h4>
            <p>leituralabialtcc@gmail.com</p>
          </div>
        </div>

        {/* Lado Direito: Social */}
        <div className="footer__social-col">
          <div className="footer__social-icons">
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
          <span>Siga-nos</span>
        </div>

      </div>

      {/* Barra Roxa de Copyright */}
      <div className="footer__bottom">
        <p>Criado por ©LipAI 2026.</p>
      </div>
    </footer>
  );
};

export default Footer;