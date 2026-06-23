import React from 'react';
import './index.css';
import Botao from '../Botao';

const ModalDeletar = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-x" onClick={onClose} aria-label="Fechar modal">
          &times;
        </button>

        <h2 className="modal-title">Você realmente deseja deletar permanentemente esse item?</h2>

        <div className="modal-actions">
          <Botao
            texto="Sim"
            corDeFundo="#9B59C3"
            corTexto="#ffffff"
            onClick={onConfirm}
          />
          <Botao
            texto="Cancelar"
            corDeFundo="transparent"
            corTexto="#333333"
            corBorda="transparent"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalDeletar;