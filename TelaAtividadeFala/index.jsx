import React, { useState } from "react";
import "./index.css";

export default function PrimeiraAtividade() {
  // Estados possíveis: idle | listening | loading | success | error
  const [status, setStatus] = useState("idle");

  function handleClickEnviar() {
    setStatus("listening");
    
    // Simulação do fluxo: ouvindo -> carregando -> sucesso ou erro
    setTimeout(() => {
      setStatus("loading");
      
      setTimeout(() => {
        // Altere para "error" se quiser testar a tela vermelha de erro
        setStatus("success"); 
      }, 2000);
    }, 2000);
  }

  function handleTentarNovamente() {
    setStatus("idle");
  }

  // Renderiza o ícone do microfone em SVG para garantir que mude de cor perfeitamente
  function renderIcon() {
    if (status === "loading") {
      return (
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    // Define a cor do microfone baseado no status atual
    let iconColor = "#6b21a8"; // Roxo padrão
    if (status === "success") iconColor = "#15803d"; // Verde escuro
    if (status === "error") iconColor = "#b91c1c"; // Vermelho escuro

    return (
      <svg className="mic-svg" viewBox="0 0 24 24" fill={iconColor} width="80" height="80">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
      </svg>
    );
  }

  return (
    <div className="container-page">
      <div className="activity-card">
        {/* HEADER */}
        <div className="header">
          <div className="header-titles">
            <h3>Primeira Atividade</h3>
            <span className="subtitle">Unidade 1</span>
          </div>
          <button className="close-btn">X</button>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-container">
          <div className="progress-bar-fill"></div>
        </div>

        {/* BOX CENTRAL QUE MUDA DE COR */}
        <div className={`status-box ${status}`}>
          {renderIcon()}
        </div>

        {/* FRASES */}
        <div className="text-container">
          <span className="video-label">Video 1</span>
          <p className="instruction-label">Frase para ser falada:</p>
          <h1 className="main-phrase">Frase para ser falada</h1>
        </div>

        {/* ACTIONS / BOTÕES */}
        <div className="actions-area">
          {status === "idle" && (
            <button className="btn-purple" onClick={handleClickEnviar}>Enviar</button>
          )}
          
          {status === "listening" && (
            <button className="btn-purple" disabled>Ouvindo...</button>
          )}

          {status === "loading" && (
            <button className="btn-purple" disabled>Processando...</button>
          )}

          {status === "success" && (
            <button className="btn-gray" onClick={handleTentarNovamente}>Próximo</button>
          )}

          {status === "error" && (
            <div className="button-group">
              <button className="btn-purple" onClick={handleTentarNovamente}>Tente Novamente</button>
              <button className="btn-gray">Próximo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}