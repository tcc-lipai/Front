import React from 'react';
import './index.css';

const Botao = ({
  texto,
  corDeFundo = '#4A154B',
  corTexto = '#FFFFFF',
  corBorda = 'transparent',
  variante, 
  onClick = () => {},
  className = ''
}) => {

  if (variante) {
    return (
      <button 
        className={`btn-generico btn-${variante} ${className}`}
        onClick={onClick}
      >
        {texto}
      </button>
    );
  }

  return (
    <button 
      className={`btn-generico ${className}`}
      style={{ 
        backgroundColor: corDeFundo,
        color: corTexto,
        border: `1.5px solid ${corBorda}`
      }}
      onClick={onClick}
    >
      {texto}
    </button>
  );
};

export default Botao;