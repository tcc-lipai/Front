import React from 'react';
import './index.css';
import { useDicionarioCard } from './hook';

export const DicionarioCard = ({
  titulo = "Laranja",
  descricao = "blabla fawdwadw",
  placeholderText = "VÍDEO LEITURA LABIAL"
}) => {
  const { isActive, toggleActive } = useDicionarioCard();

  return (
    <div className={`dicionario-container ${isActive ? 'active' : ''}`} onClick={toggleActive}>
      <div className="dicionario-sidebar-detail" />
      
      <div className="dicionario-content">
        <div className="dicionario-video-placeholder">
          <span className="placeholder-text">{placeholderText}</span>
        </div>
        
        <div className="dicionario-text-container">
          <h2 className="dicionario-title">{titulo}</h2>
          <p className="dicionario-description">{descricao}</p>
        </div>
      </div>
    </div>
  );
};

export default DicionarioCard;