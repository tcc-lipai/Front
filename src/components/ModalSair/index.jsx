import React from 'react';
import './index.css';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Botão "X" para fechar */}
        <button className="modal-close-x" onClick={onClose} aria-label="Fechar modal">
          &times;
        </button>

        <h2 className="modal-title">Deseja mesmo sair da atividade?</h2>
        <p className="modal-subtitle">Tudo que você fez até agora não será salvo</p>
        
        <div className="modal-actions">
          <button className="btn-back" onClick={onClose}>
            Voltar
          </button>
          <button className="btn-exit" onClick={onConfirm}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;