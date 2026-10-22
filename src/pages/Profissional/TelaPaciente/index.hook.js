import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarUsuario, nomeNivelDificuldade } from "../../../services/usuarioService";
import { buscarDesempenho, buscarDesempenhoPorUnidade } from "../../../services/progressoService";
import { buscarProgressoUnidadesDoPaciente } from "../../../services/acompanhamentoService";

const DIAS_PARA_CONSIDERAR_INATIVO = 7;

export const ROTULO_STATUS = {
  Concluida: "Concluída",
  EmAndamento: "Em andamento",
  NaoIniciada: "Não iniciada",
  SemAtividades: "Sem atividades",
};

function media(valores) {
  const validos = valores.filter((v) => v != null);
  if (validos.length === 0) return 0;
  return validos.reduce((soma, v) => soma + v, 0) / validos.length;
}

export function useTelaPaciente() {
  const { id } = useParams();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [desempenhoGeral, setDesempenhoGeral] = useState([]);
  const [progresso, setProgresso] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [resUsuario, resDesempenho, resPorUnidade, resProgresso] = await Promise.all([
        buscarUsuario(id),
        buscarDesempenho(id),
        buscarDesempenhoPorUnidade(id),
        buscarProgressoUnidadesDoPaciente(id),
      ]);
      if (!ativo) return;

      if (!resUsuario.sucesso) {
        setErro(resProgresso.sucesso ? resUsuario.mensagem : resProgresso.mensagem);
        setCarregando(false);
        return;
      }

      const u = resUsuario.data;
      const ultima = u.ultimaAtividadeData ?? u.UltimaAtividadeData;
      const dias = ultima ? (Date.now() - new Date(ultima).getTime()) / (1000 * 60 * 60 * 24) : Infinity;
      setPaciente({
        nome: u.nome ?? u.Nome,
        email: u.email ?? u.Email,
        diagnostico: u.diagnostico ?? u.Diagnostico,
        nivel: nomeNivelDificuldade(u.nivelDificuldade ?? u.NivelDificuldade),
        ativo: dias <= DIAS_PARA_CONSIDERAR_INATIVO,
        diasSeguidos: u.diasSeguidos ?? u.DiasSeguidos ?? 0,
      });

      const porUnidade = resPorUnidade.sucesso ? resPorUnidade.data : [];
      const d = resDesempenho.sucesso ? resDesempenho.data : {};
      setDesempenhoGeral([
        { label: "Interpretação", acertos: d.interpretacao ?? d.Interpretacao ?? 0, total: 100 },
        { label: "Fala", acertos: d.fala ?? d.Fala ?? 0, total: 100 },
        {
          label: "Vídeo",
          acertos: media(porUnidade.map((x) => x.concluidoVideo ?? x.ConcluidoVideo ?? null)),
          total: 100,
        },
        {
          label: "Acompanhante",
          acertos: media(porUnidade.map((x) => x.concluidoVibracao ?? x.ConcluidoVibracao ?? null)),
          total: 100,
        },
      ]);

      if (resProgresso.sucesso) setProgresso(resProgresso.data);
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [id]);

  const unidades = useMemo(() => {
    const todas = progresso?.unidades ?? progresso?.Unidades ?? [];
    const termo = busca.trim().toLowerCase();
    return todas
      .map((u) => ({
        id: u.unidadeId ?? u.UnidadeId,
        nome: u.nome ?? u.Nome,
        total: u.totalAtividades ?? u.TotalAtividades ?? 0,
        concluidas: u.atividadesConcluidas ?? u.AtividadesConcluidas ?? 0,
        percentual: u.percentual ?? u.Percentual ?? 0,
        status: u.status ?? u.Status,
      }))
      .filter((u) => u.nome.toLowerCase().includes(termo));
  }, [progresso, busca]);

  return { id, carregando, erro, paciente, desempenhoGeral, progresso, unidades, busca, setBusca };
}
