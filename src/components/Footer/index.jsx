import React from 'react';
import './index.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="footer-logo">Lip<span>AI</span></h2>
          <p>Sistema de leitura labial e treinamento de voz</p>
        </div>
        
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#sobre">Sobre</a>
          <a href="#participantes">Participantes</a>
          <a href="#contato">Contato</a>
        </div>

        <div className="footer-info">
          <p><strong>Telefone:</strong> +55 (11) 9999-9999</p>
          <p><strong>Email:</strong> contato@lipai.com.br</p>
        </div>
      </div>
      <div className="footer-copy">
        <p>© 2026 LipAI - Todos os direitos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;