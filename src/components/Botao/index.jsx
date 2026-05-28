import React from 'react';
import './index.css';

const Botao = ({ texto, corDeFundo = '#4A154B', onClick = () => {} }) => {
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