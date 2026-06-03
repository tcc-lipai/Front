import React, { useState } from "react";
import "./index.css";

export default function AtividadeAlternativas() {
  // Estados: 'idle' (nada selecionado), 'selected' (opção clicada), 'responded' (mostra feedback)
  const [status, setStatus] = useState("idle");
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { id: "a", text: "Option A" },
    { id: "b", text: "Option B" },
    { id: "c", text: "Option C" },
  ];

  // Defina qual ID é a resposta correta para o comportamento das cores
  const correctOptionId = "b"; 

  function handleSelectOption(id) {
    if (status === "responded") return; // Bloqueia troca após responder
    setSelectedOption(id);
    setStatus("selected");
  }

  function handleEnviar() {
    if (selectedOption) {
      setStatus("responded");
    }
  }

  function handleProximo() {
    // Reseta a tela para o estado inicial
    setStatus("idle");
    setSelectedOption(null);
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

        {/* CONTEÚDO PRINCIPAL (MOCKUP DE ALTERNATIVAS) */}
        <div className="content-layout">
          
          {/* BLOCO DO VÍDEO */}
          <div className="video-placeholder-box">
            <span className="video-placeholder-text">VIDEO DA LEITURA LABIAL</span>
          </div>

          {/* BLOCO DA PERGUNTA */}
          <div className="question-container">
            <span className="question-label">Questão 1</span>
            <p className="question-text">
              {selectedOption === "a" 
                ? "Ola?" 
                : "Aqui vai a primeira pergunta para ser respondida pelo usuário blaallaa alalal alal?"}
            </p>
          </div>

          {/* LISTA DE OPÇÕES (MÚLTIPLA ESCOLA) */}
          <div className="options-list">
            {options.map((option) => {
              // Lógica dinâmica de classes CSS com base nos mockups
              let optionClass = "option-item";
              
              if (status === "selected" && selectedOption === option.id) {
                optionClass += " selected"; // Borda/Fundo roxo clarinho
              } else if (status === "responded") {
                if (option.id === correctOptionId) {
                  optionClass += " correct"; // Verde
                } else if (selectedOption === option.id && option.id !== correctOptionId) {
                  optionClass += " incorrect"; // Vermelho/Laranja suave
                }
              }

              return (
                <button
                  key={option.id}
                  className={optionClass}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={status === "responded"}
                >
                  <span className="option-letter">{option.id})</span> {option.text}
                </button>
              );
            })}
          </div>

        </div>

        {/* SEÇÃO INFERIOR: BOTÕES OU FEEDBACK */}
        <div className="footer-area">
          {status !== "responded" ? (
            <div className="actions-area">
              <button 
                className="btn-purple" 
                onClick={handleEnviar}
                disabled={status === "idle"}
                style={{ opacity: status === "idle" ? 0.6 : 1 }}
              >
                Enviar
              </button>
            </div>
          ) : (
            /* Layout do Feedback expandido na parte inferior igual ao último mockup */
            <div className="feedback-container">
              <div className="feedback-content">
                <h4>Feedback</h4>
                <p>dwadwadwadddddddddddddddddddddddddddddddddddddddw</p>
              </div>
              <button className="btn-gray" onClick={handleProximo}>Próximo</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}