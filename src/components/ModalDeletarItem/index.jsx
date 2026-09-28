import React from "react";
import "./index.css";
import Botao from "../Botao";

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
          <Botao texto="Sim" variante="perigo" onClick={onConfirm} />
          <Botao texto="Cancelar" variante="secundario" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalDeletar;
