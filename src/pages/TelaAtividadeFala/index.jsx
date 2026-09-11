import { X } from "lucide-react";

import Fala from "../../components/Fala";
import Botao from "../../components/Botao";
import Modal from "../../components/ModalSair";
import { useTelaAtividadeFala } from "./index.hook";
import "./index.css";

const CLASSE_FONEMA = {
  correto: "correto",
  atencao: "atencao",
  incorreto: "incorreto",
};

const ResultadoFala = ({ resultado, onRefazer, onSair }) => {
  const score = Math.round(resultado.scoreAcustico ?? 0);
  const fonemas = Array.isArray(resultado.detalhesFonemas) ? resultado.detalhesFonemas : [];

  return (
    <div className="fala-resultado">
      <div className={`fala-resultado__score ${resultado.correta ? "acertou" : "errou"}`}>
        <strong>{score}%</strong>
        <span>{resultado.correta ? "Boa pronúncia!" : "Quase lá"}</span>
      </div>

      {fonemas.length > 0 && (
        <div className="fala-fonemas" aria-label="Desempenho por som">
          {fonemas.map((fonema, indice) => (
            <span
              key={`${fonema.caractere}-${indice}`}
              className={`fala-fonema fala-fonema--${CLASSE_FONEMA[fonema.status] || "atencao"}`}
              title={`${Math.round(fonema.score ?? 0)}%`}
            >
              {fonema.caractere}
            </span>
          ))}
        </div>
      )}

      {resultado.feedback && <p className="fala-resultado__feedback">{resultado.feedback}</p>}

      {resultado.correta && resultado.pontuacaoObtida != null && (
        <p className="fala-instrucao">
          +{resultado.pontuacaoObtida} moedas · saldo {resultado.novoSaldo}
        </p>
      )}

      <div className="atividade-botao fala-resultado__acoes">
        <Botao texto="Refazer" variante="secundario" onClick={onRefazer} />
        <Botao texto="Sair" onClick={onSair} />
      </div>
    </div>
  );
};

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
    refazer,
    sair,
    recarregar,
  } = useTelaAtividadeFala();

  const instrucao =
    estadoFala === "gravando"
      ? "Gravando... toque de novo para enviar."
      : estadoFala === "enviando"
        ? "Analisando a sua pronúncia..."
        : "Toque no microfone e fale a frase acima.";

  return (
    <>
      <Modal
        isOpen={mostrarModalSair}
        onClose={() => setMostrarModalSair(false)}
        onConfirm={sair}
      />

      <div className="atividade-overlay">
        <div className="atividade-container">
          <div className="atividade-header">
            <div className="atividade-titulo">
              <h1>Atividade de Fala</h1>
              <span>Pronúncia</span>
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

              {resultado ? (
                <ResultadoFala resultado={resultado} onRefazer={refazer} onSair={sair} />
              ) : (
                <>
                  <div className="fala-container">
                    <Fala estado={estadoFala} onClick={alternarGravacao} />
                  </div>

                  <p className="fala-instrucao">{instrucao}</p>

                  {erroPermissao && (
                    <p className="fala-erro-msg">
                      Precisamos da permissão do microfone para esta atividade. Libere o acesso e
                      tente de novo.
                    </p>
                  )}
                  {erroEnvio && <p className="fala-erro-msg">{erroEnvio}</p>}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TelaAtividadeFala;
