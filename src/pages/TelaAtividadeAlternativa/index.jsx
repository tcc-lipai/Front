import { X } from "lucide-react";
import "./index.css";

import Botao from "../../components/Botao";
import FeedbackCard from "../../components/FeedbackCard";
import ConquistaToast from "../../components/ConquistaToast";
import { useTelaAtividadeAlternativa } from "./index.hook";

export default function TelaAtividadeAlternativa() {
  const {
    carregando,
    erroCarga,
    licao,
    selecionada,
    respondeu,
    enviando,
    handleSelecionar,
    handleEnviar,
    handleAbrirFeedback,
    handleFechar,
    feedback,
    novasConquistas,
    handleDismissConquistas,
  } = useTelaAtividadeAlternativa();

  return (
    <div className="atividade-overlay">
      <div className="atividade-container">
        <div className="atividade-header">
          <div className="atividade-titulo">
            <h1>Atividade de Interpretação</h1>
            <span>Leitura labial</span>
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

        {carregando && (
          <div className="atividade-conteudo">
            <p>Carregando atividade...</p>
          </div>
        )}

        {!carregando && erroCarga && (
          <div className="atividade-conteudo">
            <p>{erroCarga}</p>
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

      <ConquistaToast
        conquistas={novasConquistas}
        onDismiss={handleDismissConquistas}
      />
    </div>
  );
}
