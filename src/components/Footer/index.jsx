
import React from 'react';
import './index.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <div className="footer__logo">Lip<span>AI</span></div>
          <p>Sistema de Leitura Labial e Treinamento da Fala</p>
        </div>

        <div className="footer__links">
          <div className="footer__links-col">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#participantes">Participantes</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__contact">
          <h4>Siga-nos</h4>
          <div className="footer__social">
            <a href="#">in</a>
            <a href="#">tw</a>
            <a href="#">ig</a>
          </div>
          <p style={{ marginTop: '16px' }}>Telefone:</p>
          <p>+55 (00) 00000-0000</p>
          <p>Email:</p>
          <p>lipai@contato.gr.com</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>Criado por Alupai 2026</p>
      </div>
    </footer>
  );
};

export default Footer;
