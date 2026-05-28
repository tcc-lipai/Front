import { useState } from "react";
import Modal from "../../components/ModalSair"; // Importação conectando as pastas corretamente

const TelaAcompanhante = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      {/* Esse botão simula o botão de sair da sua tela original */}
      <button onClick={() => setIsModalOpen(true)}>
        Sair da Atividade
      </button>

      {/* Componente do Modal configurado */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={() => {
          console.log("Usuário saiu!");
          setIsModalOpen(false);
          // Caso use react-router-dom, você pode colocar o navigate('/sua-rota') aqui
        }} 
      />
    </div>
  );
};

export default TelaAcompanhante;