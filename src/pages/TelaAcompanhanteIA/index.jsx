import { useState } from "react";
import "./index.css";

import { X } from "lucide-react";

import Botao from "../../components/Botao";
import Modal from "../../components/ModalSair";
import Vibracao from "../../components/Vibracao";

const TelaAcompanhante = () => {
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  const handleConfirmarSaida = () => {
    console.log("Usuário saiu da atividade");

    // navigate("/home");
    // ou:
    // window.history.back();
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

          <div className="acompanhante-texto">
            <h2>
              Pela vibração da sua voz, faça o blablabla entender as letras
            </h2>
          </div>

          <div className="vibracao-container">
            <Vibracao />
          </div>

          <div className="atividade-botao">
            <Botao
              texto="Próximo"
              corDeFundo="#9065A6"
              corTexto="#FFFFFF"
              onClick={() => console.log("Próximo")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaAcompanhante;