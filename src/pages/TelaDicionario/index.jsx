import React from 'react';
import Navbar from '../../components/Navbar/index';
import Dicionario from '../../components/Dicionario/index';
import './index.css';

const TelaDicionario = () => {
  return (
    <div className="page-wrapper">
      <Navbar /> 
      <div className="page-container">
        <Dicionario />
      </div>
    </div>
  );
};

export default TelaDicionario;