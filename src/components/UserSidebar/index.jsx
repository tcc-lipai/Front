import React, { useState } from 'react';
import { useUserSidebar } from './hook';
import './index.css';

export const UserSidebar = ({ onBackClick }) => {
  const { currentTab, avatar, handleTabChange, handleAvatarUpload } = useUserSidebar('perfil');
  // Estado para controlar a abertura do menu no mobile
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
      {/* Botão Hambúrguer - Só aparece em telas menores (Mobile/Tablet) */}
      <button className="sidebar-mobile-toggle" onClick={toggleMenu} aria-label="Abrir menu">
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Overlay escuro para fechar o menu ao clicar fora (Mobile) */}
      {isMenuOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}

      {/* A classe 'open' é aplicada dinamicamente se isMenuOpen for true */}
      <aside className={`sidebar-container ${isMenuOpen ? 'open' : ''}`}>
        {/* Botão de Voltar */}
        <div className="sidebar-header">
          {onBackClick && (
            <button className="sidebar-back-button" onClick={onBackClick} aria-label="Voltar">
              ←
            </button>
          )}
        </div>

        {/* Container do Avatar */}
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

          {/* Botão de Upload */}
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

        {/* Nome do Usuário */}
        <h2 className="sidebar-user-name">{user?.name || 'Usuário'}</h2>

        {/* Opções de Menu */}
        <nav className="sidebar-menu-list">
          <button
            className={`sidebar-menu-item ${currentTab === 'perfil' ? 'sidebar-menu-item-active' : ''}`}
            onClick={() => {
              handleTabChange('perfil');
              setIsMenuOpen(false); // Fecha o menu ao clicar na opção
            }}
          >
            Perfil
          </button>
          <button
            className={`sidebar-menu-item ${currentTab === 'configuracoes' ? 'sidebar-menu-item-active' : ''}`}
            onClick={() => {
              handleTabChange('configuracoes');
              setIsMenuOpen(false); // Fecha o menu ao clicar na opção
            }}
          >
            Configurações
          </button>
        </nav>
      </aside>
    </>
  );
};