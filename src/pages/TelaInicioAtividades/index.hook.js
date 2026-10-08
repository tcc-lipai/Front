import { useState, useEffect, useMemo } from "react";
import { listarUnidades } from "../../services/unidadeService";
import { salvarItem, dessalvarItem, listarItensSalvos } from "../../services/atividadeService";
import api from "../../services/api";

/**
 * Achata todas as lições de todas as unidades em um array plano, mantendo o
 * id da unidade dona de cada item — usado para calcular o status/"salva" por
 * unidade (não mostramos mais atividades avulsas nesta tela, só o resumo).
 */
function extrairLicoes(unidades = []) {
  const licoes = [];

  for (const unidade of unidades) {
    const unidadeId = unidade.idUnidade ?? unidade.IdUnidade;

    const fala = unidade.licoesFala ?? unidade.LicoesFala ?? [];
    for (const l of fala) {
      if ((l.atividadeFalaId ?? l.AtividadeFalaId ?? null) != null) continue;
      const id = l.idLicaoFala ?? l.IdLicaoFala;
      licoes.push({ id: `fala-${id}`, licaoId: id, tipoSalvar: "fala", unidadeId });
    }

    const atividadesFala = unidade.atividadesFala ?? unidade.AtividadesFala ?? [];
    for (const af of atividadesFala) {
      const id = af.idAtividadeFala ?? af.IdAtividadeFala;
      const exercicios = af.exercicios ?? af.Exercicios ?? [];
      const exercicioIds = exercicios.map((e) => e.idLicaoFala ?? e.IdLicaoFala);
      licoes.push({
        id: `fala-sessao-${id}`,
        licaoId: id,
        tipoSalvar: "fala-sessao",
        unidadeId,
        exercicioIds,
      });
    }

    const alt = unidade.licoesAlternativa ?? unidade.LicoesAlternativa ?? [];
    for (const l of alt) {
      const id = l.idLicaoAlternativa ?? l.IdLicaoAlternativa;
      licoes.push({ id: `alternativa-${id}`, licaoId: id, tipoSalvar: "alternativa", unidadeId });
    }

    const video = unidade.licoesVideo ?? unidade.LicoesVideo ?? [];
    for (const l of video) {
      const id = l.idLicaoVideo ?? l.IdLicaoVideo;
      licoes.push({ id: `video-${id}`, licaoId: id, tipoSalvar: "video", unidadeId });
    }
  }

  return licoes;
}

/** Resumo básico de cada unidade (nome + total de atividades que ela tem). */
function extrairUnidades(unidades = []) {
  return unidades.map((unidade) => {
    const fala = (unidade.licoesFala ?? unidade.LicoesFala ?? []).filter(
      (l) => (l.atividadeFalaId ?? l.AtividadeFalaId ?? null) == null
    ).length;
    const atividadesFala = (unidade.atividadesFala ?? unidade.AtividadesFala ?? []).length;
    const alternativa = (unidade.licoesAlternativa ?? unidade.LicoesAlternativa ?? []).length;
    const video = (unidade.licoesVideo ?? unidade.LicoesVideo ?? []).length;

    return {
      id: unidade.idUnidade ?? unidade.IdUnidade,
      nome: unidade.nome ?? unidade.Nome ?? "Unidade",
      totalAtividades: fala + atividadesFala + alternativa + video,
    };
  });
}

/**
 * Calcula status/progresso de um item. Itens de sessão (exercicioIds definido)
 * agregam o progresso de todos os exercícios que a compõem.
 */
function calcularProgressoItem(item, progressoIds) {
  if (Array.isArray(item.exercicioIds) && item.exercicioIds.length > 0) {
    const chaves = item.exercicioIds.map((id) => `fala-${id}`);
    const concluidos = chaves.filter((c) => progressoIds.concluidas.has(c)).length;
    const iniciados = chaves.filter(
      (c) => progressoIds.concluidas.has(c) || progressoIds.emAndamento.has(c)
    ).length;

    if (concluidos === chaves.length) return { statusItem: "Realizada" };
    if (iniciados > 0) return { statusItem: "Em andamento" };
    return { statusItem: "Não iniciada" };
  }

  if (progressoIds.concluidas.has(item.id)) return { statusItem: "Realizada" };
  if (progressoIds.emAndamento.has(item.id)) return { statusItem: "Em andamento" };
  return { statusItem: "Não iniciada" };
}

/**
 * Combina o resumo de cada unidade com o progresso/itens salvos do usuário,
 * produzindo status ("Realizada"/"Em andamento"/"Não iniciada"/"Sem atividades"),
 * percentual concluído e se a unidade tem algo salvo.
 */
function calcularResumoUnidades(unidadesBase, itens, progressoIds, chavesSalvas) {
  return unidadesBase.map((unidade) => {
    const itensDaUnidade = itens.filter((i) => i.unidadeId === unidade.id);

    if (itensDaUnidade.length === 0) {
      return {
        ...unidade,
        status: "Sem atividades",
        progresso: 0,
        salva: chavesSalvas.has(`unidade:${unidade.id}`),
      };
    }

    const statusItens = itensDaUnidade.map((i) => calcularProgressoItem(i, progressoIds).statusItem);
    const concluidos = statusItens.filter((s) => s === "Realizada").length;
    const iniciados = statusItens.filter((s) => s !== "Não iniciada").length;

    const status =
      concluidos === itensDaUnidade.length
        ? "Realizada"
        : iniciados > 0
          ? "Em andamento"
          : "Não iniciada";

    const salva = chavesSalvas.has(`unidade:${unidade.id}`);

    return {
      ...unidade,
      status,
      progresso: Math.round((concluidos / itensDaUnidade.length) * 100),
      salva,
    };
  });
}

export function useTelaInicioAtividades() {
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const [todasLicoes, setTodasLicoes] = useState([]);
  const [unidadesBase, setUnidadesBase] = useState([]);
  const [progressoIds, setProgressoIds] = useState({ emAndamento: new Set(), concluidas: new Set() });
  const [carregando, setCarregando] = useState(true);

  const [atividadesSalvasIds, setAtividadesSalvasIds] = useState(new Set());

  const [modalAberto, setModalAberto] = useState(null); // "realizadas" | "salvas" | null

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);
  const abrirModalRealizadas = () => setModalAberto("realizadas");
  const abrirModalSalvas = () => setModalAberto("salvas");
  const fecharModal = () => setModalAberto(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);

      const resUnidades = await listarUnidades();
      if (resUnidades.sucesso) {
        setTodasLicoes(extrairLicoes(resUnidades.data));
        setUnidadesBase(extrairUnidades(resUnidades.data));
      }

      const usuarioId = localStorage.getItem("id");
      if (usuarioId) {
        try {
          const res = await api.get(`/Progresso/usuario/${usuarioId}`);
          const data = res.data;

          const emAndamento = new Set();
          const concluidas = new Set();

          for (const p of data?.Alternativas ?? data?.alternativas ?? []) {
            const chave = `alternativa-${p.LicaoAlternativaId ?? p.licaoAlternativaId}`;
            const st = p.Status ?? p.status;
            if (st === "EmAndamento" || st === 1) emAndamento.add(chave);
            if (st === "Concluido" || st === 2) concluidas.add(chave);
          }

          for (const p of data?.Falas ?? data?.falas ?? []) {
            const chave = `fala-${p.LicaoFalaId ?? p.licaoFalaId}`;
            const st = p.Status ?? p.status;
            if (st === "EmAndamento" || st === 1) emAndamento.add(chave);
            if (st === "Concluido" || st === 2) concluidas.add(chave);
          }

          for (const p of data?.Videos ?? data?.videos ?? []) {
            const chave = `video-${p.LicaoVideoId ?? p.licaoVideoId}`;
            const st = p.Status ?? p.status;
            if (st === "Concluido" || st === 2) concluidas.add(chave);
          }

          setProgressoIds({ emAndamento, concluidas });
        } catch {
          // progresso indisponível — trata tudo como "não iniciada"
        }

        const resSalvos = await listarItensSalvos();
        if (resSalvos.sucesso) {
          const chaves = new Set(
            resSalvos.data.map((s) => `${s.tipoItem ?? s.TipoItem}:${s.itemId ?? s.ItemId}`)
          );
          setAtividadesSalvasIds(chaves);
        }
      }

      setCarregando(false);
    }

    carregar();
  }, []);

  const toggleSalvarUnidade = async (unidadeId, novoEstado) => {
    const chave = `unidade:${unidadeId}`;

    if (novoEstado) {
      const res = await salvarItem("unidade", unidadeId);
      if (res.sucesso) {
        setAtividadesSalvasIds((prev) => new Set([...prev, chave]));
      }
    } else {
      const res = await dessalvarItem("unidade", unidadeId);
      if (res.sucesso) {
        setAtividadesSalvasIds((prev) => {
          const copia = new Set(prev);
          copia.delete(chave);
          return copia;
        });
      }
    }
  };

  const resumoUnidades = useMemo(
    () => calcularResumoUnidades(unidadesBase, todasLicoes, progressoIds, atividadesSalvasIds),
    [unidadesBase, todasLicoes, progressoIds, atividadesSalvasIds]
  );

  const unidadesDisponiveis = useMemo(() => {
    const termo = busca.toLowerCase();
    return resumoUnidades.filter((u) => u.nome.toLowerCase().includes(termo));
  }, [resumoUnidades, busca]);

  const unidadesRealizadas = useMemo(
    () => resumoUnidades.filter((u) => u.status === "Realizada"),
    [resumoUnidades]
  );
  const unidadesSalvas = useMemo(() => resumoUnidades.filter((u) => u.salva), [resumoUnidades]);

  return {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    busca,
    setBusca,
    unidadesDisponiveis,
    carregando,
    qtdRealizadas: unidadesRealizadas.length,
    qtdSalvas: unidadesSalvas.length,
    unidadesRealizadas,
    unidadesSalvas,
    modalAberto,
    abrirModalRealizadas,
    abrirModalSalvas,
    fecharModal,
    toggleSalvarUnidade,
  };
}
