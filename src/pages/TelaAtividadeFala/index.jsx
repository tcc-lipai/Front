import { X } from "lucide-react";

import Fala from "../../components/Fala";
import Botao from "../../components/Botao";
import Modal from "../../components/ModalSair";
import FeedbackCard from "../../components/FeedbackCard";
import ConquistaToast from "../../components/ConquistaToast";
import LicaoConcluida from "../../components/LicaoConcluida";
import { useTelaAtividadeFala } from "./index.hook";
import "./index.css";

const TelaAtividadeFala = () => {
  const {
    carregando,
    erroCarga,
    frase,
    estadoFala,
    resultado,
    erroEnvio,
    erroPermissao,
    mostrarModalSair,
    setMostrarModalSair,
    alternarGravacao,
    handleConcluir,
    refazer,
    sair,
    recarregar,
    novasConquistas,
    handleDismissConquistas,
    feedback,
    licaoConcluida,
  } = useTelaAtividadeFala();

  const respondeu = !!resultado;

  const instrucao =
    estadoFala === "gravando"
      ? "Gravando... toque de novo para enviar."
      : estadoFala === "enviando"
        ? "Analisando a sua pronúncia..."
        : respondeu
          ? ""
          : "Toque no microfone e fale a frase acima.";

  return (
    <>
      <Modal
        isOpen={mostrarModalSair}
        onClose={() => setMostrarModalSair(false)}
        onConfirm={sair}
      />

      <LicaoConcluida
        isOpen={licaoConcluida.isOpen}
        stats={licaoConcluida.stats}
        onClose={licaoConcluida.onClose}
        onRetry={licaoConcluida.onRetry}
        onExit={licaoConcluida.onExit}
      />

      <div className="atividade-overlay">
        <div className="atividade-container">
          <div className="atividade-header">
            <div className="atividade-titulo">
              <h1>Atividade de Fala</h1>
              <span>Pronúncia</span>
            </div>

            <div className="atividade-progresso">
              <div className="barra-progresso">
                <div className="progresso" style={{ width: respondeu ? "100%" : "0%" }} />
              </div>
            </div>

            <button
              className="btn-fechar"
              onClick={() => setMostrarModalSair(true)}
              aria-label="Sair da atividade"
            >
              <X size={32} />
            </button>
          </div>

          {carregando && <p className="fala-instrucao">Carregando a atividade...</p>}

          {!carregando && erroCarga && (
            <div className="fala-erro-msg">
              <p>{erroCarga}</p>
              <Botao texto="Tentar de novo" onClick={recarregar} />
            </div>
          )}

          {!carregando && !erroCarga && (
            <>
              <div className="atividade-conteudo">
                <h2>Frase para ser falada:</h2>
              </div>

              <div className="frase-container">
                <p>{frase || "—"}</p>
              </div>

              <div className="fala-container">
                <Fala estado={estadoFala} onClick={alternarGravacao} disabled={respondeu} />
              </div>

              {instrucao && <p className="fala-instrucao">{instrucao}</p>}

              {erroPermissao && (
                <p className="fala-erro-msg">
                  Precisamos da permissão do microfone para esta atividade. Libere o acesso e
                  tente de novo.
                </p>
              )}
              {erroEnvio && <p className="fala-erro-msg">{erroEnvio}</p>}

              {respondeu && (
                <div className="atividade-botao">
                  <Botao texto="Próximo" variante="secundario" onClick={handleConcluir} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FeedbackCard
        isOpen={feedback.isOpen}
        onClose={feedback.closeFeedback}
        text={feedback.feedbackText}
        type={feedback.feedbackType}
        stars={feedback.feedbackStars}
        percentage={feedback.feedbackPercentage}
        fonemas={resultado?.detalhesFonemas}
        onNext={feedback.handleProximaAtividade}
        onRetry={refazer}
      />

      <ConquistaToast
        conquistas={novasConquistas}
        onDismiss={handleDismissConquistas}
      />
    </>
  );
};

export default TelaAtividadeFala;
