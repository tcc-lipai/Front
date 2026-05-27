import React from 'react';
import './index.css';
import biaImage from '../../assets/img/bia_licaoconcluida.png'; 
import estrelaIcon from '../../assets/img/estrela.png';
import relogioIcon from '../../assets/img/relogio.png';

const LicaoConcluida = ({ isOpen, onClose, stats, onRetry, onExit }) => {
  if (!isOpen) return null;

  const handleRetry = () => {
    if (onRetry) onRetry();
    onClose();
  };

  const handleExit = () => {
    if (onExit) onExit();
    onClose();
  };

  return (
    <div className="licao-overlay" onClick={onClose}>
      <div className="licao-modal" onClick={(e) => e.stopPropagation()}>
        
        <h1 className="licao-title">Lição Concluída</h1>
        <p className="licao-subtitle">você concluiu a atividade com sucesso!</p>
        
        <div className="licao-content-container">
          <div className="licao-score-circle">
            <span className="licao-score-text">{stats?.percentage || 0}%</span>
          </div>
          
          <div className="licao-stats-info">
            <div className="licao-stat-row">
              <img src={estrelaIcon} alt="Estrela" className="licao-stat-img" />
              <span className="licao-stat-text">+{stats?.stars || 0}</span>
            </div>
            <div className="licao-stat-row">
              <img src={relogioIcon} alt="Relógio" className="licao-stat-img" />
              <span className="licao-stat-text">{stats?.time || '00:00'}</span>
            </div>
          </div>
          
          <div className="licao-character-wrapper">
            <div className="licao-character-shadow">
              <img 
                src={biaImage} 
                alt="Personagem Bia celebrando" 
                className="licao-character-img" 
              />
            </div>
          </div>
        </div>
        
        <div className="licao-footer-buttons">
          <button className="licao-btn-retry" onClick={handleRetry}>
            Refazer
          </button>
          <button className="licao-btn-exit" onClick={handleExit}>
            Sair
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default LicaoConcluida;