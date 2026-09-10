import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

import Botao from "../../components/Botao";
import FeedbackCard from "../../components/FeedbackCard";
import { useFeedback } from "../../components/FeedbackCard/hooks"; // <-- Ajuste o caminho conforme o seu projeto
import { FEEDBACK_TYPES } from "../../components/FeedbackCard/types"; // <-- Ajuste o caminho conforme o seu projeto

import { X } from "lucide-react";

export default function TelaAtividadeAlternativa() {
  const [selecionada, setSelecionada] = useState(null);
  const [respondeu, setRespondeu] = useState(false);

  const navigate = useNavigate();

  // 1. Iniciando o hook de feedback
  const { isOpen, feedbackText, feedbackType, openFeedback, closeFeedback } = useFeedback();

  const alternativas = [
    { id: 1, letra: "a", texto: "Option A", correta: false },
    { id: 2, letra: "b", texto: "Option B", correta: true },
    { id: 3, letra: "c", texto: "Option C", correta: false },
  ];

  const handleEnviar = () => {
    if (selecionada === null) return;
    setRespondeu(true);
  };

  const handleFechar = () => {
    navigate(-1);
  };

  // 2. Função para abrir o feedback com o texto e cor certos
  const handleAbrirFeedback = () => {
    const alternativaEscolhida = alternativas.find((alt) => alt.id === selecionada);

    if (alternativaEscolhida.correta) {
      openFeedback("Parabéns, você acertou!", FEEDBACK_TYPES.SUCCESS);
    } else {
      openFeedback("Poxa, resposta incorreta. Tente novamente!", FEEDBACK_TYPES.ERROR);
    }
  };

  // 3. Função para quando clicar em "Próximo" DENTRO do feedback
  const handleProximaAtividade = () => {
    // Aqui você pode navegar para a próxima questão ou tela final
    navigate("/proxima-atividade"); // <-- Troque para a rota que você quiser
  };

  return (
    <div className="atividade-overlay">
      <div className="atividade-container">
        {/* ... (Todo o cabeçalho e vídeo continuam iguais) ... */}
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

          <button className="btn-fechar" onClick={handleFechar}>
            <X size={32} />
          </button>
        </div>

        <div className="video-container">
          <div className="video-placeholder">
            <span>VIDEO DA LEITURA LABIAL</span>
          </div>
        </div>

        <div className="atividade-conteudo">
          <span className="questao-numero">Questão 1</span>

          <h2 className="pergunta">
            Aqui vai a primeira pergunta para ser respondida pelo usuário blaalala alalal alal?
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
                    if (!respondeu) setSelecionada(alternativa.id);
                  }}
                >
                  <span className="option-letter">{alternativa.letra})</span>
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
                onClick={handleAbrirFeedback} // <-- Chama o modal de feedback
              />
            )}
          </div>
        </div>
      </div>

      {/* 4. O modal de Feedback fica aqui, renderizado por cima de tudo */}
      <FeedbackCard
        isOpen={isOpen}
        onClose={closeFeedback}
        text={feedbackText}
        type={feedbackType}
        onNext={handleProximaAtividade} // Passamos o nome da função sem os parênteses
      />
    </div>
  );
}
