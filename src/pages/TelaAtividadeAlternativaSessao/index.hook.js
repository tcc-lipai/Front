import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFeedback } from "../../components/FeedbackCard/index.hook";
import { FEEDBACK_TYPES } from "../../components/FeedbackCard/index.types";
import { useLicaoConcluida } from "../../components/LicaoConcluida/index.hook";
import { buscarAtividadeAlternativa, buscarLicaoAlternativa } from "../../services/licaoService";
import { iniciarAlternativa, concluirAlternativa } from "../../services/progressoService";
import { formatarDuracao } from "../../utils/tempo";

const ROTA_SAIDA = "/atividades-unidades";
const LETRAS = ["a", "b", "c", "d"];

function normalizarLicao(licao) {
  const opcoes = LETRAS.map((letra) => ({
    letra,
    texto: licao[letra] ?? licao[letra.toUpperCase()],
  })).filter((opcao) => opcao.texto);

  return {
    pergunta: licao.pergunta ?? licao.Pergunta ?? "",
    respostaCerta: String(licao.respostaCerta ?? licao.RespostaCerta ?? "").toLowerCase(),
    videoUrl: licao.videoUrl ?? licao.VideoUrl ?? "",
    opcoes,
  };
}

export function useTelaAtividadeAlternativaSessao() {
  const { id: atividadeAlternativaId } = useParams();
  const navigate = useNavigate();
  const { isOpen, feedbackText, feedbackType, openFeedback, closeFeedback } = useFeedback();
  const licaoConcluida = useLicaoConcluida();

  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [nomeAtividade, setNomeAtividade] = useState("");
  const [idsExercicios, setIdsExercicios] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  const [licao, setLicao] = useState(null);
  const [selecionada, setSelecionada] = useState(null);
  const [respondeu, setRespondeu] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [novasConquistas, setNovasConquistas] = useState([]);
  const [resultadosSessao, setResultadosSessao] = useState([]);
  const [sessaoConcluida, setSessaoConcluida] = useState(false);

  const inicioRef = useRef(null);
  useEffect(() => {
    inicioRef.current = Date.now();
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const res = await buscarAtividadeAlternativa(atividadeAlternativaId);
      if (!ativo) return;
      if (!res.sucesso) {
        setErroCarga(res.mensagem);
        setCarregando(false);
        return;
      }

      const info = res.data;
      if (info.idsExercicios.length === 0) {
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
  }, [atividadeAlternativaId]);

  useEffect(() => {
    if (idsExercicios.length === 0) return;
    let ativo = true;

    async function carregarExercicio() {
      const licaoId = idsExercicios[indiceAtual];
      const licaoRes = await buscarLicaoAlternativa(licaoId);
      if (!ativo) return;
      if (!licaoRes.sucesso) {
        setErroCarga(licaoRes.mensagem);
        return;
      }
      setLicao(normalizarLicao(licaoRes.data));
    }

    carregarExercicio();
    return () => {
      ativo = false;
    };
  }, [idsExercicios, indiceAtual]);

  const handleSelecionar = (letra) => {
    if (!respondeu) setSelecionada(letra);
  };

  const handleEnviar = async () => {
    if (selecionada === null || enviando) return;
    setEnviando(true);

    const licaoId = idsExercicios[indiceAtual];
    const inicioRes = await iniciarAlternativa(licaoId);
    if (!inicioRes.sucesso) {
      setEnviando(false);
      setResultado({ correta: false, mensagem: inicioRes.mensagem });
      setRespondeu(true);
      return;
    }

    const res = await concluirAlternativa(inicioRes.idProgresso, selecionada);
    setEnviando(false);
    setRespondeu(true);

    if (res.sucesso) {
      setResultado(res.data);
      // guarda por índice do exercício — se o aluno refizer, o novo resultado
      // substitui o anterior em vez de somar mais uma entrada na contagem.
      setResultadosSessao((atual) => {
        const copia = [...atual];
        copia[indiceAtual] = {
          correta: res.data.correta,
          pontuacaoObtida: res.data.pontuacaoObtida ?? 0,
        };
        return copia;
      });

      if (res.data.novasConquistas && res.data.novasConquistas.length > 0) {
        setNovasConquistas(res.data.novasConquistas);
      }
    } else {
      setResultado({ correta: false, mensagem: res.mensagem });
    }
  };

  const handleAbrirFeedback = () => {
    if (!resultado) return;
    if (resultado.correta) {
      openFeedback(
        `Parabéns, você acertou! +${resultado.pontuacaoObtida ?? 0} moedas.`,
        FEEDBACK_TYPES.SUCCESS
      );
    } else {
      openFeedback(
        resultado.mensagem || "Poxa, resposta incorreta. Tente novamente!",
        FEEDBACK_TYPES.ERROR
      );
    }
  };

  const proximo = () => {
    if (indiceAtual + 1 >= idsExercicios.length) {
      setSessaoConcluida(true);
      return;
    }
    setSelecionada(null);
    setRespondeu(false);
    setResultado(null);
    setLicao(null);
    setIndiceAtual((i) => i + 1);
  };

  const refazerSessao = () => {
    setIndiceAtual(0);
    setResultadosSessao([]);
    setSelecionada(null);
    setRespondeu(false);
    setResultado(null);
    setSessaoConcluida(false);
    inicioRef.current = Date.now();
  };

  const sair = () => navigate(ROTA_SAIDA);
  const handleFechar = () => navigate(-1);

  const resultadosValidos = resultadosSessao.filter(Boolean);
  const somaCoins = resultadosValidos.reduce((soma, r) => soma + r.pontuacaoObtida, 0);
  // arredonda pra 2 casas — soma de decimais em ponto flutuante gera erro tipo 29.990000000000002
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

  return {
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
    novasConquistas,
    handleDismissConquistas: () => setNovasConquistas([]),
    sessaoConcluida,
    totalCoins,
    totalCorretas,
    feedback: { isOpen, feedbackText, feedbackType, closeFeedback, handleProximaAtividade: proximo },
    licaoConcluida: {
      isOpen: licaoConcluida.isOpen,
      stats: licaoConcluida.lessonStats,
      onClose: licaoConcluida.closeLicaoConcluida,
      onRetry: refazerSessao,
      onExit: sair,
    },
  };
}
