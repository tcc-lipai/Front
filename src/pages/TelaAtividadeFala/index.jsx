import { useState } from "react";
import "./index.css";

import { X } from "lucide-react";

import Fala from "../../components/Fala";
import Botao from "../../components/Botao";
import FeedbackCard from "../../components/FeedbackCard";
import Modal from "../../components/ModalSair";

const TelaAtividadeFala = () => {
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  if (mostrarFeedback) {
    return <FeedbackCard />;
  }

  const handleEnviar = () => {
    setMostrarFeedback(true);
  };

  const handleConfirmarSaida = () => {
    console.log("Usuário saiu da atividade");
  };

  return (
    <>
      <Modal
        isOpen={mostrarModalSair}
        onClose={() => setMostrarModalSair(false)}
        onConfirm={handleConfirmarSaida}
      />

      <div className="atividade-overlay">
        <div className="atividade-container">
          <div className="atividade-header">
            <div className="atividade-titulo">
              <h1>Primeira Atividade</h1>
              <span>Unidade 1</span>
            </div>

            <div className="atividade-progresso">
              <div className="barra-progresso">
                <div className="progresso" />
              </div>
            </div>

            <button
              className="btn-fechar"
              onClick={() => setMostrarModalSair(true)}
            >
              <X size={38} />
            </button>
          </div>

          <div className="fala-container">
            <Fala />
          </div>

          <div className="atividade-conteudo">
            <span className="video-numero">Vídeo 1</span>

            <h2>Frase para ser falada:</h2>
          </div>

          <div className="frase-container">
            <p>Frase para ser falada</p>
          </div>

          <div className="atividade-botao">
            <Botao
              texto="Enviar"
              corDeFundo="#9065A6"
              corTexto="#FFFFFF"
              onClick={handleEnviar}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaAtividadeFala;