import React from 'react';
import { Star, Bell, User } from 'lucide-react';
import { useHeaderActions } from './index.hook';
import './index.css';

export const HeaderActions = () => {
  const { xp, hasNotification, handleProfileClick, handleNotificationClick } = useHeaderActions();

  return (
    <div className="header-actions-container">
      {/* Contador de Estrelas / XP */}
      <div className="star-counter">
        <Star 
          className="star-icon" 
          color="#FFC107" /* Borda amarela */
          fill="#FFC107"  /* Preenchimento amarelo */
          size={20} 
        />
        {/* Deixei o XP aqui, mas se no Figma for vazio, pode apagar a linha abaixo */}
        <span className="xp-value">{xp}</span>
      </div>

      {/* Botão de Notificação */}
      <button 
        className={`action-btn notification-btn ${hasNotification ? 'active' : ''}`}
        onClick={handleNotificationClick}
        aria-label="Notificações"
      >
        <Bell size={20} color="white" fill="white" />
      </button>

      {/* Botão de Perfil */}
      <button 
        className="action-btn profile-btn"
        onClick={handleProfileClick}
        aria-label="Perfil do usuário"
      >
        <User size={20} color="white" fill="white" />
      </button>
    </div>
  );
};