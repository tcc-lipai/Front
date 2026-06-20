import React from 'react';
import { Star, Bell, User } from 'lucide-react';
import { useHeaderActions } from './index.hook';
import './index.css';

export const HeaderActions = ({ onOpenProfile }) => {
  const { xp, hasNotification, handleNotificationClick } = useHeaderActions();

  return (
    <div className="header-actions-container">
      
      <div className="star-counter">
        <Star 
          className="star-icon" 
          color="#FFC107" 
          fill="#FFC107"  
          size={20} 
        />
        <span className="xp-value">{xp}</span>
      </div>

      <div className="buttons-wrapper">
        <button 
          type="button" 
          className={`action-btn notification-btn ${hasNotification ? 'active' : ''}`}
          onClick={handleNotificationClick}
          aria-label="Notificações"
        >
          <Bell size={20} color="white" fill="white" />
        </button>

        <button 
          type="button" 
          className="action-btn profile-btn"
          onClick={onOpenProfile} 
          aria-label="Perfil do usuário"
        >
          <User size={20} color="white" fill="white" />
        </button>
      </div>

    </div>
  );
};