import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarDesempenhoPorUnidade } from "../../../services/progressoService";
import { buscarUsuario, nomeNivelDificuldade } from "../../../services/usuarioService";
import { buscarProgressoUnidadeDoPaciente } from "../../../services/acompanhamentoService";

function pegar(obj, ...chaves) {
  for (const c of chaves) {
    if (obj?.[c] !== undefined && obj?.[c] !== null) return obj[c];
  }
  return null;
}

export function useTelaPacienteUnidade() {
  const { id, unidadeId } = useParams();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [unidade, setUnidade] = useState(null);
  const [barrasUnidade, setBarrasUnidade] = useState([]);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [resUnidade, resDesempenho, resUsuario] = await Promise.all([
        buscarProgressoUnidadeDoPaciente(id, unidadeId),
        buscarDesempenhoPorUnidade(id),
        buscarUsuario(id),
      ]);
      if (!ativo) return;

      if (!resUnidade.sucesso) {
        setErro(resUnidade.mensagem);
        setCarregando(false);
        return;
      }

      const d = resUnidade.data;
      const tipos = pegar(d, "tipos", "Tipos") ?? {};
      const desempenho =
        (resDesempenho.sucesso ? resDesempenho.data : []).find(
          (x) => String(x.unidadeId ?? x.UnidadeId) === String(unidadeId)
        ) ?? {};

      // só mostra barras dos tipos que existem nessa unidade (no nível do paciente)
      const total = (t) => pegar(pegar(tipos, t, t[0].toUpperCase() + t.slice(1)), "total", "Total") ?? 0;
      const barras = [];
      if (total("interpretacao") > 0) {
        barras.push({ label: "Interpretação", acertos: pegar(desempenho, "acertoInterpretacao", "AcertoInterpretacao") ?? 0, total: 100 });
      }
      if (total("fala") > 0) {
        barras.push({ label: "Fala", acertos: pegar(desempenho, "acertoFala", "AcertoFala") ?? 0, total: 100 });
      }
      if (total("video") > 0) {
        barras.push({ label: "Vídeo", acertos: pegar(desempenho, "concluidoVideo", "ConcluidoVideo") ?? 0, total: 100 });
      }
      if (total("acompanhante") > 0) {
        barras.push({ label: "Acompanhante", acertos: pegar(desempenho, "concluidoVibracao", "ConcluidoVibracao") ?? 0, total: 100 });
      }

      setBarrasUnidade(barras);
      setGrupos(
        (pegar(d, "gruposFala", "GruposFala") ?? []).map((g) => ({
          id: g.idAtividadeFala ?? g.IdAtividadeFala,
          nome: g.nome ?? g.Nome,
          nivel: nomeNivelDificuldade(g.nivel ?? g.Nivel),
          totalExercicios: g.totalExercicios ?? g.TotalExercicios,
          concluidos: g.exerciciosConcluidos ?? g.ExerciciosConcluidos,
          percentual: g.percentual ?? g.Percentual ?? 0,
          acerto: g.acerto ?? g.Acerto ?? null,
          notaMedia: g.notaMedia ?? g.NotaMedia ?? null,
        }))
      );
      setUnidade({
        nome: pegar(d, "nome", "Nome"),
        total: pegar(d, "totalAtividades", "TotalAtividades") ?? 0,
        concluidas: pegar(d, "atividadesConcluidas", "AtividadesConcluidas") ?? 0,
        percentual: pegar(d, "percentual", "Percentual") ?? 0,
        nivel: nomeNivelDificuldade(pegar(d, "nivel", "Nivel")),
      });
      if (resUsuario.sucesso) setNomePaciente(resUsuario.data.nome ?? resUsuario.data.Nome ?? "");
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [id, unidadeId]);

  return { id, carregando, erro, nomePaciente, unidade, barrasUnidade, grupos };
}
