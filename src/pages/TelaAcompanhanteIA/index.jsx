import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importado o hook
import "./index.css";

import { X } from "lucide-react";

import Botao from "../../components/Botao";
import Modal from "../../components/ModalSair";
import Vibracao from "../../components/Vibracao";

const TelaAcompanhanteIA = () => {
  const [mostrarModalSair, setMostrarModalSair] = useState(false);
  const navigate = useNavigate(); // 2. Instanciando o navigate

  const handleConfirmarSaida = () => {
    navigate("/atividades-unidades"); // 3. Navegando para fora ao confirmar saída
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

            <button className="btn-fechar" onClick={() => setMostrarModalSair(true)}>
              <X size={38} />
            </button>
          </div>

          <div className="acompanhante-texto">
            <h2>Pela vibração da sua voz, faça o blablabla entender as letras</h2>
          </div>

          <div className="vibracao-container">
            <Vibracao />
          </div>

          <div className="atividade-botao">
            <Botao
              texto="Próximo"
              corDeFundo="#9065A6"
              corTexto="#FFFFFF"
              onClick={() => navigate("/atividades-unidades")} // 4. Botão Próximo levando para a próxima etapa ou conclusão
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaAcompanhanteIA;
