import { useNavigate } from "react-router-dom";
import "./index.css";

import { X } from "lucide-react";

import Botao from "../../components/Botao";
import Modal from "../../components/ModalSair";
import LicaoConcluida from "../../components/LicaoConcluida";
import Vibracao from "../../components/Vibracao";
import { useTelaAcompanhanteIA } from "./index.hook";

const TelaAcompanhanteIA = () => {
  const navigate = useNavigate();
  const {
    carregando,
    erro,
    silaba,
    instrucao,
    mostrarModalSair,
    setMostrarModalSair,
    handleFinalizar,
    sair,
    licaoConcluida,
  } = useTelaAcompanhanteIA();

  return (
    <>
      <Modal
        isOpen={mostrarModalSair}
        onClose={() => setMostrarModalSair(false)}
        onConfirm={sair}
      />

      <LicaoConcluida
        isOpen={licaoConcluida.isOpen}
        stats={licaoConcluida.stats}
        onClose={licaoConcluida.onClose}
        onRetry={licaoConcluida.onRetry}
        onExit={licaoConcluida.onExit}
      />

      <div className="atividade-overlay">
        <div className="atividade-container">
          <div className="atividade-header">
            <div className="atividade-titulo">
              <h1>Acompanhante</h1>
              <span>Vibração da voz</span>
            </div>

            <button className="btn-fechar" onClick={() => setMostrarModalSair(true)}>
              <X size={38} />
            </button>
          </div>

          {carregando && (
            <div className="acompanhante-texto">
              <p>Carregando...</p>
            </div>
          )}

          {!carregando && erro && (
            <div className="acompanhante-texto">
              <p>{erro}</p>
              <Botao texto="Voltar" onClick={() => navigate("/atividades-unidades")} />
            </div>
          )}

          {!carregando && !erro && (
            <>
              <div className="acompanhante-texto">
                <h2>{instrucao || "Fale a sílaba apoiando a mão na garganta para sentir a vibração."}</h2>
              </div>

              <div className="vibracao-container">
                <Vibracao silaba={silaba} />
              </div>

              <div className="atividade-botao">
                <Botao texto="Concluir" onClick={handleFinalizar} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TelaAcompanhanteIA;
