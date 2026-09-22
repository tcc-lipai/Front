import { X } from "lucide-react";

import Fala from "../../components/Fala";
import Botao from "../../components/Botao";
import Modal from "../../components/ModalSair";
import ConquistaToast from "../../components/ConquistaToast";
import { useTelaAtividadeFalaSessao } from "./index.hook";
import "../TelaAtividadeFala/index.css";

const CLASSE_FONEMA = {
  correto: "correto",
  atencao: "atencao",
  incorreto: "incorreto",
};

const ResultadoFala = ({ resultado, ultimoExercicio, onProximo, onSair }) => {
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
        <Botao texto={ultimoExercicio ? "Concluir" : "Próximo"} onClick={onProximo} />
        <Botao texto="Sair" variante="secundario" onClick={onSair} />
      </div>
    </div>
  );
};

const SessaoConcluida = ({ totalExercicios, totalCorretas, totalCoins, onSair }) => (
  <div className="fala-resultado">
    <div className="fala-resultado__score acertou">
      <strong>
        {totalCorretas}/{totalExercicios}
      </strong>
      <span>Atividade concluída!</span>
    </div>
    <p className="fala-instrucao">Você ganhou {totalCoins} moedas nessa atividade.</p>
    <div className="atividade-botao fala-resultado__acoes">
      <Botao texto="Voltar" onClick={onSair} />
    </div>
  </div>
);

const TelaAtividadeFalaSessao = () => {
  const {
    carregando,
    erroCarga,
    nomeAtividade,
    frase,
    indiceAtual,
    totalExercicios,
    estadoFala,
    resultado,
    erroEnvio,
    erroPermissao,
    mostrarModalSair,
    setMostrarModalSair,
    alternarGravacao,
    proximo,
    refazer,
    sair,
    novasConquistas,
    handleDismissConquistas,
    sessaoConcluida,
    totalCoins,
    totalCorretas,
  } = useTelaAtividadeFalaSessao();

  const ultimoExercicio = indiceAtual + 1 >= totalExercicios;

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
              <h1>{nomeAtividade || "Atividade de Fala"}</h1>
              {!carregando && !erroCarga && !sessaoConcluida && (
                <span>
                  Exercício {indiceAtual + 1} de {totalExercicios}
                </span>
              )}
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
              <Botao texto="Voltar" onClick={sair} />
            </div>
          )}

          {!carregando && !erroCarga && sessaoConcluida && (
            <SessaoConcluida
              totalExercicios={totalExercicios}
              totalCorretas={totalCorretas}
              totalCoins={totalCoins}
              onSair={sair}
            />
          )}

          {!carregando && !erroCarga && !sessaoConcluida && (
            <>
              <div className="atividade-conteudo">
                <h2>Frase para ser falada:</h2>
              </div>

              <div className="frase-container">
                <p>{frase || "—"}</p>
              </div>

              {resultado ? (
                <ResultadoFala
                  resultado={resultado}
                  ultimoExercicio={ultimoExercicio}
                  onProximo={proximo}
                  onSair={sair}
                />
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
                  {erroEnvio && (
                    <div className="fala-erro-msg">
                      <p>{erroEnvio}</p>
                      <Botao texto="Tentar de novo" onClick={refazer} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <ConquistaToast conquistas={novasConquistas} onDismiss={handleDismissConquistas} />
    </>
  );
};

export default TelaAtividadeFalaSessao;
