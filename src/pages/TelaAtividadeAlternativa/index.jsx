import React, { useState } from "react";
import "./index.css";

import Botao from "../../components/Botao";
import FeedbackCard from "../../components/FeedbackCard";
import Modal from "../../components/ModalSair";

import { X } from "lucide-react";

export default function TelaAtividadeAlternativa() {
  const [selecionada, setSelecionada] = useState(null);
  const [respondeu, setRespondeu] = useState(false);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  const alternativas = [
    {
      id: 1,
      letra: "a",
      texto: "Option A",
      correta: false,
    },
    {
      id: 2,
      letra: "b",
      texto: "Option B",
      correta: true,
    },
    {
      id: 3,
      letra: "c",
      texto: "Option C",
      correta: false,
    },
  ];

  const handleEnviar = () => {
    if (selecionada === null) return;

    setRespondeu(true);
  };

  const handleConfirmarSaida = () => {
    console.log("Usuário saiu da atividade");

    // Exemplo:
    // window.history.back();

    // ou:
    // navigate("/home");
  };

  if (mostrarFeedback) {
    return <FeedbackCard />;
  }

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
              <X size={32} />
            </button>
          </div>

          <div className="video-container">
            <div className="video-placeholder">
              <span>VIDEO DA LEITURA LABIAL</span>
            </div>
          </div>

          <div className="atividade-conteudo">
            <span className="questao-numero">
              Questão 1
            </span>

            <h2 className="pergunta">
              Aqui vai a primeira pergunta para ser respondida pelo usuário
              blaalala alalal alal?
            </h2>

            <div className="linha-divisoria" />

            <div className="options-list">
              {alternativas.map((alternativa) => {
                let estado = "";

                if (!respondeu) {
                  if (selecionada === alternativa.id) {
                    estado = "selected";
                  }
                } else {
                  if (alternativa.correta) {
                    estado = "correct";
                  } else if (selecionada === alternativa.id) {
                    estado = "incorrect";
                  }
                }

                return (
                  <button
                    key={alternativa.id}
                    className={`option-item ${estado}`}
                    onClick={() => {
                      if (!respondeu) {
                        setSelecionada(alternativa.id);
                      }
                    }}
                  >
                    <span className="option-letter">
                      {alternativa.letra})
                    </span>

                    {alternativa.texto}
                  </button>
                );
              })}
            </div>

            <div className="atividade-botao">
              {!respondeu ? (
                <Botao
                  texto="Enviar"
                  corDeFundo="#9065A6"
                  corTexto="#FFFFFF"
                  onClick={handleEnviar}
                />
              ) : (
                <Botao
                  texto="Próximo"
                  corDeFundo="#D9D2E2"
                  corTexto="#5B2D74"
                  onClick={() => setMostrarFeedback(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}