import React from 'react';
import Navbar from '../../components/Navbar/index';
import './index.css';
import { HeaderActions } from '../../components/infoEstrelas/index';

const TelaDashboard = () => {
  return (
    <div className="Container">
      <Navbar />
      <main className="contentContainer">
        <HeaderActions />
        <h1 style={{ color: '#4a154b', margin: 0 }}>Dashboard</h1>
        <p>Se você está vendo isso, as rotas funcionam e a Navbar está no lugar certo.</p>
      </main>
    </div>
  );
};

export default TelaDashboard;