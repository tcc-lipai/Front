import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFeedback } from "../../components/FeedbackCard/index.hook";
import { FEEDBACK_TYPES } from "../../components/FeedbackCard/index.types";
import { buscarLicaoAlternativa } from "../../services/licaoService";
import { iniciarAlternativa, concluirAlternativa } from "../../services/progressoService";

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
    opcoes,
  };
}

export function useTelaAtividadeAlternativa() {
  const { id: licaoId } = useParams();
  const navigate = useNavigate();
  const { isOpen, feedbackText, feedbackType, openFeedback, closeFeedback } = useFeedback();

  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [novasConquistas, setNovasConquistas] = useState([]);
  const [licao, setLicao] = useState(null);

  const [selecionada, setSelecionada] = useState(null);
  const [respondeu, setRespondeu] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const licaoRes = await buscarLicaoAlternativa(licaoId);
      if (!ativo) return;
      if (!licaoRes.sucesso) {
        setErroCarga(licaoRes.mensagem);
        setCarregando(false);
        return;
      }
      setLicao(normalizarLicao(licaoRes.data));
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [licaoId]);

  const handleSelecionar = (letra) => {
    if (!respondeu) setSelecionada(letra);
  };

  const handleEnviar = async () => {
    if (selecionada === null || enviando) return;
    setEnviando(true);

    // só registra o progresso no momento em que o aluno de fato responde
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

  const handleProximaAtividade = () => {
    navigate(ROTA_SAIDA);
  };

  const handleFechar = () => navigate(-1);

  return {
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
    feedback: { isOpen, feedbackText, feedbackType, closeFeedback, handleProximaAtividade },
    novasConquistas,
    handleDismissConquistas: () => setNovasConquistas([]),
  };
}
