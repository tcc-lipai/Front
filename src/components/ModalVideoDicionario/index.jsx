import { X } from "lucide-react";
import "./index.css";

export const ModalVideoDicionario = ({ isOpen, onClose, titulo, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay tv-overlay" onClick={onClose}>
      <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x tv-modal__fechar" onClick={onClose} aria-label="Fechar">
          <X size={24} />
        </button>

        <div className="tv-modal__moldura">
          <div className="tv-modal__tela">
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay className="tv-modal__video" />
            ) : (
              <span className="tv-modal__sem-video">Vídeo ainda não disponível</span>
            )}
          </div>
          <div className="tv-modal__botoes">
            <span />
            <span />
          </div>
        </div>
        <div className="tv-modal__pe" />

        <h2 className="tv-modal__titulo">{titulo}</h2>
      </div>
    </div>
  );
};

export default ModalVideoDicionario;
