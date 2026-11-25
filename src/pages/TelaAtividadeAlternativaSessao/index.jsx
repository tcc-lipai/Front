import { Check, X } from "lucide-react";
import "../TelaAtividadeAlternativa/index.css";

import Botao from "../../components/Botao";
import FeedbackCard from "../../components/FeedbackCard";
import ConquistaToast from "../../components/ConquistaToast";
import LicaoConcluida from "../../components/LicaoConcluida";
import { useTelaAtividadeAlternativaSessao } from "./index.hook";

export default function TelaAtividadeAlternativaSessao() {
  const {
    carregando,
    erroCarga,
    nomeAtividade,
    licao,
    indiceAtual,
    totalExercicios,
    progressoPercent,
    selecionada,
    respondeu,
    enviando,
    handleSelecionar,
    handleEnviar,
    handleAbrirFeedback,
    handleFechar,
    sair,
    feedback,
    licaoConcluida,
    novasConquistas,
    handleDismissConquistas,
  } = useTelaAtividadeAlternativaSessao();

  return (
    <div className="atividade-overlay">
      <div className="atividade-container">
        <div className="atividade-header">
          <div className="atividade-titulo">
            <h1>{nomeAtividade || "Atividade de Interpretação"}</h1>
            {!carregando && !erroCarga && (
              <span>
                Vídeo {Math.min(indiceAtual + 1, totalExercicios)} de {totalExercicios}
              </span>
            )}
          </div>

          <div className="atividade-progresso">
            <div className="barra-progresso">
              <div className="progresso" style={{ width: `${progressoPercent}%` }} />
            </div>
          </div>

          <button className="btn-fechar" onClick={handleFechar} aria-label="Sair da atividade">
            <X size={32} />
          </button>
        </div>

        <div className="video-container">
          {licao?.videoUrl ? (
            <video className="video-placeholder" src={licao.videoUrl} controls />
          ) : (
            <div className="video-placeholder">
              <span>VIDEO DA LEITURA LABIAL</span>
            </div>
          )}
        </div>

        {carregando && (
          <div className="atividade-conteudo">
            <p className="carregando-atrasado">Carregando atividade...</p>
          </div>
        )}

        {!carregando && erroCarga && (
          <div className="atividade-conteudo">
            <p>{erroCarga}</p>
            <Botao texto="Voltar" onClick={sair} />
          </div>
        )}

        {!carregando && !erroCarga && licao && (
          <div className="atividade-conteudo">
            <span className="questao-numero">Questão</span>

            <h2 className="pergunta">{licao.pergunta}</h2>

            <div className="linha-divisoria" />

            <div className="options-list">
              {licao.opcoes.map((opcao) => {
                let estado = "";

                if (!respondeu) {
                  if (selecionada === opcao.letra) estado = "selected";
                } else if (opcao.letra === licao.respostaCerta) {
                  estado = "correct";
                } else if (selecionada === opcao.letra) {
                  estado = "incorrect";
                }

                return (
                  <button
                    key={opcao.letra}
                    className={`option-item ${estado}`}
                    onClick={() => handleSelecionar(opcao.letra)}
                    disabled={respondeu}
                  >
                    <span className="option-letter">{opcao.letra})</span>
                    {opcao.texto}
                    {estado === "correct" && (
                      <Check size={18} className="option-item__icone-estado" aria-label="Resposta certa" />
                    )}
                    {estado === "incorrect" && (
                      <X size={18} className="option-item__icone-estado" aria-label="Resposta errada" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="atividade-botao">
              {!respondeu ? (
                <Botao
                  texto={enviando ? "Enviando..." : "Enviar"}
                  onClick={handleEnviar}
                  disabled={selecionada === null || enviando}
                />
              ) : (
                <Botao texto="Próximo" variante="secundario" onClick={handleAbrirFeedback} />
              )}
            </div>
          </div>
        )}
      </div>

      <FeedbackCard
        isOpen={feedback.isOpen}
        onClose={feedback.closeFeedback}
        text={feedback.feedbackText}
        type={feedback.feedbackType}
        onNext={feedback.handleProximaAtividade}
      />

      <LicaoConcluida
        isOpen={licaoConcluida.isOpen}
        stats={licaoConcluida.stats}
        onClose={licaoConcluida.onClose}
        onRetry={licaoConcluida.onRetry}
        onExit={licaoConcluida.onExit}
      />

      <ConquistaToast conquistas={novasConquistas} onDismiss={handleDismissConquistas} />
    </div>
  );
}
