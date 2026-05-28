import React from 'react';
import './index.css';

const Botao = ({ texto, corDeFundo, onClick }) => {
  return (
    <button 
      className="btn-generico" 
      style={{ backgroundColor: corDeFundo }}
      onClick={onClick}
    >
      {texto}
    </button>
  );
};

export default Botao;