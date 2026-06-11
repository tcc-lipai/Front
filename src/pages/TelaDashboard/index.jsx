import React from 'react';
import Navbar from '../../components/Navbar/index'; // Ajuste o caminho se a sua estrutura for diferente

const TelaDashboard = () => {
  return (
    <div style={styles.pageContainer}>
      {/* 1. A Navbar renderizada diretamente aqui */}
      <Navbar />

      {/* 2. O conteúdo da sua página com um espaçamento para não sumir atrás da barra */}
      <main style={styles.contentContainer}>
        <h1>Bem-vindo à Dashboard!</h1>
        <p>Se você está vendo isso, as rotas funcionam e a Navbar está no lugar certo.</p>
      </main>
    </div>
  );
};

// Estilos inline simples para garantir o alinhamento correto
const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#fdf8ff', // Cor de fundo leve (opcional)
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: '110px', // IMPORTANTE: Abre espaço para a Navbar não cobrir o texto
    paddingTop: '40px',
    paddingRight: '20px',
  },
};

export default TelaDashboard;