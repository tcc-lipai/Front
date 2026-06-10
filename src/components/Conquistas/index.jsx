// Conquistas/index.jsx
import React from 'react';
import './index.css';
import medalhaImg from '../../assets/img/medalha.png';

const Conquistas = ({ title, subtitle }) => {
  return (
    <div className="conquista-card">
      <div className="conquista-icon-container">
        <img 
          src={medalhaImg} 
          alt="Medalha da Conquista" 
          className="conquista-icon-img" 
        />
      </div>
      
      <h3 className="conquista-title">{title || 'Semana Ouro'}</h3>
      <p className="conquista-subtitle">{subtitle || 'Semana Ouro'}</p>
    </div>
  );
};

export default Conquistas;