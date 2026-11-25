import React from "react";
import "./index.css";

export const DicionarioCard = ({
  titulo = "Laranja",
  descricao = "blabla fawdwadw",
  imagemUrl = "",
  placeholderText = "VÍDEO LEITURA LABIAL",
  onAbrir = () => {},
}) => {
  return (
    <div className="dicionario-container" onClick={onAbrir}>
      <div className="dicionario-sidebar-detail" />

      <div className="dicionario-content">
        {imagemUrl ? (
          <div className="dicionario-imagem-container">
            <img src={imagemUrl} alt={titulo} className="dicionario-imagem" />
          </div>
        ) : (
          <div className="dicionario-video-placeholder">
            <span className="placeholder-text">{placeholderText}</span>
          </div>
        )}

        <div className="dicionario-text-container">
          <h2 className="dicionario-title">{titulo}</h2>
          <p className="dicionario-description">{descricao}</p>
        </div>
      </div>
    </div>
  );
};

export default DicionarioCard;
