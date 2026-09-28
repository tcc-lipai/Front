import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGravadorAudio } from "../../hooks/useGravadorAudio";
import { useFeedback } from "../../components/FeedbackCard/index.hook";
import { FEEDBACK_TYPES } from "../../components/FeedbackCard/index.types";
import { useLicaoConcluida } from "../../components/LicaoConcluida/index.hook";
import { buscarLicaoFala, iniciarFala, concluirFala } from "../../services/falaService";
import { formatarDuracao } from "../../utils/tempo";

const ROTA_SAIDA = "/atividades-unidades";

export function useTelaAtividadeFala() {
  const { id: licaoId } = useParams();
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
  const licaoConcluida = useLicaoConcluida();

  const [tentativaCarga, setTentativaCarga] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [licao, setLicao] = useState(null);
  const [idProgresso, setIdProgresso] = useState(null);

  const [estadoFala, setEstadoFala] = useState("ocioso");
  const [resultado, setResultado] = useState(null);
  const [erroEnvio, setErroEnvio] = useState("");
  const [novasConquistas, setNovasConquistas] = useState([]);

  const [mostrarModalSair, setMostrarModalSair] = useState(false);
  const promiseIniciarRef = useRef(null);
  const inicioRef = useRef(Date.now());

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const licaoRes = await buscarLicaoFala(licaoId);
      if (!ativo) return;
      if (!licaoRes.sucesso) {
        setErroCarga(licaoRes.mensagem);
        setCarregando(false);
        return;
      }
      setLicao(licaoRes.data);
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [licaoId, tentativaCarga]);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setErroCarga("");
    setErroEnvio("");
    setResultado(null);
    setEstadoFala("ocioso");
    setTentativaCarga((n) => n + 1);
  }, []);

  const alternarGravacao = useCallback(async () => {
    setErroEnvio("");

    if (estadoFala === "ocioso" || estadoFala === "erro") {
      const ok = await gravador.iniciar();
      if (!ok) return;

      // grava já — só registra o progresso quando o aluno de fato começa a
      // gravar, mas isso não pode atrasar o começo da gravação em si (senão
      // fica um pedaço de silêncio antes da fala, atrapalhando a nota).
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
  }, [estadoFala, gravador, licaoId, openFeedback]);

  const refazer = useCallback(async () => {
    setResultado(null);
    setErroEnvio("");
    setEstadoFala("ocioso");
    inicioRef.current = Date.now();

    // o progresso anterior já foi concluído; abre uma nova tentativa
    const inicioRes = await iniciarFala(licaoId);
    if (inicioRes.sucesso) {
      setIdProgresso(inicioRes.idProgresso);
    } else {
      setErroEnvio(inicioRes.mensagem);
    }
  }, [licaoId]);

  const sair = useCallback(() => {
    gravador.cancelar();
    navigate(ROTA_SAIDA);
  }, [gravador, navigate]);

  const handleConcluir = useCallback(() => {
    const segundos = (Date.now() - inicioRef.current) / 1000;
    licaoConcluida.openLicaoConcluida({
      percentage: resultado?.correta ? 100 : 0,
      stars: resultado?.pontuacaoObtida ?? 0,
      time: formatarDuracao(segundos),
    });
  }, [resultado, licaoConcluida]);

  return {
    carregando,
    erroCarga,
    frase: licao?.fraseEsperada ?? licao?.FraseEsperada ?? "",
    estadoFala,
    resultado,
    erroEnvio,
    erroPermissao: gravador.erroPermissao,
    mostrarModalSair,
    setMostrarModalSair,
    alternarGravacao,
    handleConcluir,
    refazer,
    sair,
    recarregar,
    novasConquistas,
    handleDismissConquistas: () => setNovasConquistas([]),
    feedback: {
      isOpen,
      feedbackText,
      feedbackType,
      feedbackStars,
      feedbackPercentage,
      closeFeedback,
      handleProximaAtividade: handleConcluir,
    },
    licaoConcluida: {
      isOpen: licaoConcluida.isOpen,
      stats: licaoConcluida.lessonStats,
      onClose: licaoConcluida.closeLicaoConcluida,
      onRetry: refazer,
      onExit: sair,
    },
  };
}
