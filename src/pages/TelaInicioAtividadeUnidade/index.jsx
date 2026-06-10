import React from 'react';
import Navbar from "../../components/Navbar";
import Filtro from '../../components/Filtro/index.jsx';
import Unidades from '../../components/Unidades/index.jsx';
import './index.css';

const TelaInicioAtividadeUnidade = () => {
  return (
    <div className="page-wrapper">

      <div className="col-navbar">
        <Navbar />
      </div>

      <div className="col-unidades">
        <Unidades />
      </div>

      <div className="col-filtro">
        <Filtro />
      </div>
    </div>
  );
};

export default TelaInicioAtividadeUnidade;