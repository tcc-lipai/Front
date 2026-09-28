import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGravadorAudio } from "../../hooks/useGravadorAudio";
import { useFeedback } from "../../components/FeedbackCard/index.hook";
import { FEEDBACK_TYPES } from "../../components/FeedbackCard/index.types";
import { useLicaoConcluida } from "../../components/LicaoConcluida/index.hook";
import { buscarLicaoFala, iniciarFala, concluirFala } from "../../services/falaService";
import { listarUnidades } from "../../services/unidadeService";
import { formatarDuracao } from "../../utils/tempo";

const ROTA_SAIDA = "/atividades-unidades";

function extrairAtividade(unidades, atividadeFalaId) {
  for (const unidade of unidades) {
    const atividades = unidade.atividadesFala ?? unidade.AtividadesFala ?? [];
    const encontrada = atividades.find(
      (af) => String(af.idAtividadeFala ?? af.IdAtividadeFala) === String(atividadeFalaId)
    );
    if (encontrada) {
      const exercicios = encontrada.exercicios ?? encontrada.Exercicios ?? [];
      return {
        nome: encontrada.nome ?? encontrada.Nome ?? "Atividade de fala",
        idsExercicios: exercicios.map((e) => e.idLicaoFala ?? e.IdLicaoFala),
      };
    }
  }
  return null;
}

export function useTelaAtividadeFalaSessao() {
  const { id: atividadeFalaId } = useParams();
  const navigate = useNavigate();
  const gravador = useGravadorAudio();
  const {
    isOpen,
    feedbackText,
    feedbackType,
    feedbackStars,
    feedbackPercentage,
    openFeedback,
    closeFeedback,
  } = useFeedback();

  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [nomeAtividade, setNomeAtividade] = useState("");
  const [idsExercicios, setIdsExercicios] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  const [licao, setLicao] = useState(null);
  const [idProgresso, setIdProgresso] = useState(null);

  const [estadoFala, setEstadoFala] = useState("ocioso");
  const [resultado, setResultado] = useState(null);
  const [erroEnvio, setErroEnvio] = useState("");
  const [novasConquistas, setNovasConquistas] = useState([]);
  const [resultadosSessao, setResultadosSessao] = useState([]);
  const [sessaoConcluida, setSessaoConcluida] = useState(false);

  const [mostrarModalSair, setMostrarModalSair] = useState(false);
  const promiseIniciarRef = useRef(null);
  const inicioRef = useRef(Date.now());
  const licaoConcluida = useLicaoConcluida();

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const res = await listarUnidades();
      if (!ativo) return;
      if (!res.sucesso) {
        setErroCarga(res.mensagem);
        setCarregando(false);
        return;
      }

      const info = extrairAtividade(res.data, atividadeFalaId);
      if (!info || info.idsExercicios.length === 0) {
        setErroCarga("Atividade não encontrada.");
        setCarregando(false);
        return;
      }

      setNomeAtividade(info.nome);
      setIdsExercicios(info.idsExercicios);
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [atividadeFalaId]);

  useEffect(() => {
    if (idsExercicios.length === 0) return;
    let ativo = true;

    async function carregarExercicio() {
      const licaoId = idsExercicios[indiceAtual];
      const licaoRes = await buscarLicaoFala(licaoId);
      if (!ativo) return;
      if (!licaoRes.sucesso) {
        setErroCarga(licaoRes.mensagem);
        return;
      }
      setLicao(licaoRes.data);
    }

    carregarExercicio();
    return () => {
      ativo = false;
    };
  }, [idsExercicios, indiceAtual]);

  const alternarGravacao = useCallback(async () => {
    setErroEnvio("");

    if (estadoFala === "ocioso" || estadoFala === "erro") {
      const ok = await gravador.iniciar();
      if (!ok) return;

      // grava já — só registra o progresso quando o aluno de fato começa a
      // gravar, mas isso não pode atrasar o começo da gravação em si (senão
      // fica um pedaço de silêncio antes da fala, atrapalhando a nota).
      const licaoId = idsExercicios[indiceAtual];
      setEstadoFala("gravando");
      promiseIniciarRef.current = iniciarFala(licaoId);
      return;
    }

    if (estadoFala === "gravando") {
      const blob = await gravador.parar();
      if (!blob || blob.size === 0) {
        setEstadoFala("erro");
        setErroEnvio("Não capturamos nenhum áudio. Tente gravar de novo.");
        return;
      }

      setEstadoFala("enviando");

      const inicioRes = await promiseIniciarRef.current;
      if (!inicioRes?.sucesso) {
        setEstadoFala("erro");
        setErroEnvio(inicioRes?.mensagem || "Não foi possível iniciar a atividade.");
        return;
      }
      setIdProgresso(inicioRes.idProgresso);

      const res = await concluirFala(inicioRes.idProgresso, blob);
      if (!res.sucesso) {
        setEstadoFala("erro");
        setErroEnvio(res.mensagem);
        return;
      }

      setResultado(res.data);
      setEstadoFala(res.data.correta ? "correto" : "incorreto");
      // guarda por índice do exercício — se o aluno refizer, o novo resultado
      // substitui o anterior em vez de somar mais uma entrada na contagem.
      setResultadosSessao((atual) => {
        const copia = [...atual];
        copia[indiceAtual] = { correta: res.data.correta, pontuacaoObtida: res.data.pontuacaoObtida ?? 0 };
        return copia;
      });

      const texto = res.data.correta
        ? res.data.feedback || "Boa pronúncia!"
        : res.data.feedback || res.data.mensagem || "Quase lá. Tente de novo.";
      openFeedback(
        texto,
        res.data.correta ? FEEDBACK_TYPES.SUCCESS : FEEDBACK_TYPES.ERROR,
        res.data.pontuacaoObtida ?? 0,
        Math.round(res.data.scoreAcustico ?? 0)
      );

      if (res.data.novasConquistas && res.data.novasConquistas.length > 0) {
        setNovasConquistas(res.data.novasConquistas);
      }
    }
  }, [estadoFala, gravador, idsExercicios, indiceAtual, openFeedback]);

  const proximo = useCallback(() => {
    if (indiceAtual + 1 >= idsExercicios.length) {
      setSessaoConcluida(true);
      return;
    }
    setResultado(null);
    setErroEnvio("");
    setEstadoFala("ocioso");
    setLicao(null);
    setIdProgresso(null);
    setIndiceAtual((i) => i + 1);
  }, [indiceAtual, idsExercicios.length]);

  const refazer = useCallback(async () => {
    setResultado(null);
    setErroEnvio("");
    setEstadoFala("ocioso");

    const licaoId = idsExercicios[indiceAtual];
    const inicioRes = await iniciarFala(licaoId);
    if (inicioRes.sucesso) {
      setIdProgresso(inicioRes.idProgresso);
    } else {
      setErroEnvio(inicioRes.mensagem);
    }
  }, [idsExercicios, indiceAtual]);

  const sair = useCallback(() => {
    gravador.cancelar();
    navigate(ROTA_SAIDA);
  }, [gravador, navigate]);

  const resultadosValidos = resultadosSessao.filter(Boolean);
  const somaCoins = resultadosValidos.reduce((soma, r) => soma + r.pontuacaoObtida, 0);
  // arredonda pra 2 casas — soma de decimais em ponto flutuante (ex.: 5.998 x 5)
  // gera erro tipo 29.990000000000002
  const totalCoins = Math.round(somaCoins * 100) / 100;
  const totalCorretas = resultadosValidos.filter((r) => r.correta).length;

  const totalExercicios = idsExercicios.length;
  const progressoPercent = sessaoConcluida
    ? 100
    : totalExercicios > 0
      ? Math.round((indiceAtual / totalExercicios) * 100)
      : 0;

  useEffect(() => {
    if (!sessaoConcluida) return;
    const total = idsExercicios.length;
    const segundos = (Date.now() - inicioRef.current) / 1000;
    licaoConcluida.openLicaoConcluida({
      percentage: total > 0 ? Math.round((totalCorretas / total) * 100) : 0,
      stars: totalCoins,
      time: formatarDuracao(segundos),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessaoConcluida]);

  const refazerSessao = useCallback(() => {
    setIndiceAtual(0);
    setResultadosSessao([]);
    setResultado(null);
    setEstadoFala("ocioso");
    setSessaoConcluida(false);
    inicioRef.current = Date.now();
  }, []);

  return {
    carregando,
    erroCarga,
    nomeAtividade,
    frase: licao?.fraseEsperada ?? licao?.FraseEsperada ?? "",
    indiceAtual,
    totalExercicios,
    progressoPercent,
    estadoFala,
    resultado,
    erroEnvio,
    erroPermissao: gravador.erroPermissao,
    mostrarModalSair,
    setMostrarModalSair,
    alternarGravacao,
    proximo,
    refazer,
    sair,
    novasConquistas,
    handleDismissConquistas: () => setNovasConquistas([]),
    sessaoConcluida,
    totalCoins,
    totalCorretas,
    feedback: {
      isOpen,
      feedbackText,
      feedbackType,
      feedbackStars,
      feedbackPercentage,
      closeFeedback,
      handleProximaAtividade: proximo,
    },
    licaoConcluida: {
      isOpen: licaoConcluida.isOpen,
      stats: licaoConcluida.lessonStats,
      onClose: licaoConcluida.closeLicaoConcluida,
      onRetry: refazerSessao,
      onExit: sair,
    },
  };
}
