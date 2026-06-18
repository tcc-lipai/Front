import React from 'react';
import { X, Bell, User } from 'lucide-react';
import { useUserProfileDrawer } from './index.hook';
import { formatPhone } from './utils';
import './index.css';

export const UserProfileDrawer = ({ isOpen, onClose, userData }) => {
  const { handleEditProfileClick } = useUserProfileDrawer(onClose);

  // Dados de fallback caso o userData não seja passado
  const data = userData || {
    username: 'Username',
    email: 'username@gmail.com',
    diagnostic: 'Deficiência auditiva',
    fullName: 'User Silva Santos',
    birthDate: '08/02/2000',
    phone: '+55 11 1245 432'
  };

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}
      
      <div className={`drawer-container ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="close-btn" onClick={onClose}>
            <X size={24} color="#8A6B8E" />
          </button>
          <button className="drawer-notification-btn">
            <Bell size={20} color="white" fill="white" />
          </button>
        </div>

        <div className="drawer-profile-info">
          <div className="avatar-circle">
            <User size={48} color="white" />
          </div>
          <h2 className="username">{data.username}</h2>
          <span className="user-email">{data.email}</span>
        </div>

        <div className="drawer-details">
          <p><strong>Diagnóstico:</strong> {data.diagnostic}</p>
          <p><strong>Nome completo:</strong> {data.fullName}</p>
          <p><strong>Data de nascimento:</strong> {data.birthDate}</p>
          <p><strong>Telefone:</strong> {formatPhone(data.phone)}</p>
        </div>

        <button className="edit-profile-btn" onClick={handleEditProfileClick}>
          Editar Perfil
        </button>
      </div>
    </>
  );
};