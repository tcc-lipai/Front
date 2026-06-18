import React, { useState, useEffect } from "react";
import "./index.css";


export default function Fala() {
  // O próprio componente agora controla o seu estado interno
  // 'idle' -> 'recording' (espera 5s) -> 'correct' ou 'incorrect'
  const [status, setStatus] = useState("idle");


  useEffect(() => {
    let temporizador;


    // Se o status mudar para gravando, inicia a contagem de 5 segundos
    if (status === "recording") {
      temporizador = setTimeout(() => {
        // Sorteia entre correto (verde) ou incorreto (vermelho)
        const acertou = Math.random() > 0.5;
        setStatus(acertou ? "correct" : "incorrect");
      }, 5000); // 5 segundos
    }


    // Limpa o temporizador se o componente for desmontado para evitar bugs de memória
    return () => clearTimeout(temporizador);
  }, [status]);


  const handleClique = () => {
    // Só deixa clicar se estiver no estado inicial (idle)
    if (status === "idle") {
      setStatus("recording");
    } else if (status === "correct" || status === "incorrect") {
      // Clique extra: se já terminou, um novo clique reseta para testar de novo
      setStatus("idle");
    }
  };


  // Renderiza o ícone interno baseado no status atual
  const renderIcon = () => {
    if (status === "recording") {
      return (
        <svg width="40" height="10" viewBox="0 0 40 10" fill="currentColor">
          <circle cx="6" cy="5" r="5" />
          <circle cx="20" cy="5" r="5" />
          <circle cx="34" cy="5" r="5" />
        </svg>
      );
    }


    return (
      <svg width="32" height="42" viewBox="0 0 24 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="currentColor" stroke="none" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  };


  return (
    <button
      className={`fala-box ${status}`}
      onClick={handleClique}
      disabled={status === "recording"} // Só desabilita enquanto estiver contando os 5s
    >
      <div className="icon-container">
        {renderIcon()}
      </div>
    </button>
  );
}
