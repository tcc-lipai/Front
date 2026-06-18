import React, { useState } from 'react';
import { useUserSidebar } from './hook';
import './index.css';


export const UserSidebar = ({ onBackClick }) => {
  const { currentTab, avatar, handleTabChange, handleAvatarUpload } = useUserSidebar('perfil');
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const user = {
    name: 'User Silva Santos',
    avatarUrl: ''
  };


  const fotoExibida = avatar || user?.avatarUrl;


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <>
      <button className="sidebar-mobile-toggle" onClick={toggleMenu} aria-label="Abrir menu">
        {isMenuOpen ? '✕' : '☰'}
      </button>


      {isMenuOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}


      <aside className={`sidebar-container ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {onBackClick && (
            <button className="sidebar-back-button" onClick={onBackClick} aria-label="Voltar">
              ←
            </button>
          )}
        </div>


        <div className="sidebar-avatar-container">
          <div className="sidebar-avatar">
            {fotoExibida ? (
              <img src={fotoExibida} alt={user?.name} />
            ) : (
              <svg className="sidebar-avatar-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>


          <label htmlFor="avatar-input" className="sidebar-status-indicator" title="Mudar foto">
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>


        <h2 className="sidebar-user-name">{user?.name || 'Usuário'}</h2>


        <nav className="sidebar-menu-list">
          <button
            className={`sidebar-menu-item ${currentTab === 'perfil' ? 'sidebar-menu-item-active' : ''}`}
            onClick={() => {
              handleTabChange('perfil');
              setIsMenuOpen(false); 
            }}
          >
            Perfil
          </button>
          <button
            className={`sidebar-menu-item ${currentTab === 'configuracoes' ? 'sidebar-menu-item-active' : ''}`}
            onClick={() => {
              handleTabChange('configuracoes');
              setIsMenuOpen(false); 
            }}
          >
            Configurações
          </button>
        </nav>
      </aside>
    </>
  );
};


