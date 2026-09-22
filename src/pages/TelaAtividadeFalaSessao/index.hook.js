import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGravadorAudio } from "../../hooks/useGravadorAudio";
import { buscarLicaoFala, iniciarFala, concluirFala } from "../../services/falaService";
import { listarUnidades } from "../../services/unidadeService";

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

      const inicioRes = await iniciarFala(licaoId);
      if (!ativo) return;
      if (!inicioRes.sucesso) {
        setErroCarga(inicioRes.mensagem);
        return;
      }
      setIdProgresso(inicioRes.idProgresso);
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
      if (ok) setEstadoFala("gravando");
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
      const res = await concluirFala(idProgresso, blob);
      if (!res.sucesso) {
        setEstadoFala("erro");
        setErroEnvio(res.mensagem);
        return;
      }

      setResultado(res.data);
      setEstadoFala(res.data.correta ? "correto" : "incorreto");
      setResultadosSessao((atual) => [
        ...atual,
        { correta: res.data.correta, pontuacaoObtida: res.data.pontuacaoObtida ?? 0 },
      ]);

      if (res.data.novasConquistas && res.data.novasConquistas.length > 0) {
        setNovasConquistas(res.data.novasConquistas);
      }
    }
  }, [estadoFala, gravador, idProgresso]);

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

  const totalCoins = resultadosSessao.reduce((soma, r) => soma + r.pontuacaoObtida, 0);
  const totalCorretas = resultadosSessao.filter((r) => r.correta).length;

  return {
    carregando,
    erroCarga,
    nomeAtividade,
    frase: licao?.fraseEsperada ?? licao?.FraseEsperada ?? "",
    indiceAtual,
    totalExercicios: idsExercicios.length,
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
  };
}
