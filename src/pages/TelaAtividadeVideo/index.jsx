import "./index.css";
import Botao from "../../components/Botao";
import Modal from "../../components/ModalSair";
import { useTelaAtividadeVideo } from "./index.hook";

import { X } from "lucide-react";

const TelaAtividadeVideo = () => {
  const {
    carregando,
    erro,
    titulo,
    descricao,
    videoUrl,
    mostrarModalSair,
    setMostrarModalSair,
    handleFinalizar,
    handleConfirmarSaida,
  } = useTelaAtividadeVideo();

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
              <h1>Vídeo-aula</h1>
              <span>Leitura labial</span>
            </div>

            <div className="atividade-progresso">
              <div className="barra-progresso">
                <div className="progresso"></div>
              </div>
            </div>

            <button className="btn-fechar" onClick={() => setMostrarModalSair(true)}>
              <X size={38} />
            </button>
          </div>

          <div className="video-container">
            {videoUrl ? (
              <video className="video-placeholder" src={videoUrl} controls />
            ) : (
              <div className="video-placeholder">
                <span>VÍDEO AULA</span>
              </div>
            )}
          </div>

          {carregando && (
            <div className="atividade-conteudo">
              <p>Carregando...</p>
            </div>
          )}

          {!carregando && erro && (
            <div className="atividade-conteudo">
              <p>{erro}</p>
            </div>
          )}

          {!carregando && !erro && (
            <div className="atividade-conteudo">
              <h2>{titulo}</h2>
              <p>{descricao}</p>
            </div>
          )}

          <div className="atividade-botao">
            <Botao texto="Finalizar" onClick={handleFinalizar} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaAtividadeVideo;
