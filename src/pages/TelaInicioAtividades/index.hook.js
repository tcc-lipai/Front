import { useState, useEffect, useMemo } from "react";
import { listarUnidades } from "../../services/unidadeService";
import { salvarItem, dessalvarItem, listarItensSalvos } from "../../services/atividadeService";
import { buscarUsuario } from "../../services/usuarioService";
import api from "../../services/api";

const NIVEL_LABEL = {
  Iniciante: "Iniciante",
  Basico: "Básico",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
  1: "Iniciante",
  2: "Básico",
  3: "Intermediário",
  4: "Avançado",
};

/**
 * Achata todas as lições de todas as unidades em um array plano.
 * Cada item fica com: { id, licaoId, tipo, titulo, descricao, dificuldade, unidadeNome }
 */
function extrairLicoes(unidades = []) {
  const licoes = [];

  for (const unidade of unidades) {
    const nome = unidade.nome ?? unidade.Nome ?? "";
    // atividadeId de topo — usado para salvar/dessalvar
    const atividadeId = unidade.atividadeId ?? unidade.AtividadeId;

    // Fala avulsa (sem atividade que a agrupe) — cai direto no exercício.
    const fala = unidade.licoesFala ?? unidade.LicoesFala ?? [];
    for (const l of fala) {
      if ((l.atividadeFalaId ?? l.AtividadeFalaId ?? null) != null) continue;
      const id = l.idLicaoFala ?? l.IdLicaoFala;
      licoes.push({
        id: `fala-${id}`,
        licaoId: id,
        atividadeId,
        tipo: "fala",
        tipoSalvar: "fala",
        titulo: `Fala: ${l.fraseEsperada ?? l.FraseEsperada ?? nome}`,
        descricao: `Pratique a pronúncia da frase "${l.fraseEsperada ?? l.FraseEsperada ?? ""}"`,
        dificuldade:
          NIVEL_LABEL[l.nivelDificuldade ?? l.NivelDificuldade] ?? "Básico",
        unidadeNome: nome,
      });
    }

    // Atividade de fala (sessão com vários exercícios) — vira 1 card só.
    const atividadesFala = unidade.atividadesFala ?? unidade.AtividadesFala ?? [];
    for (const af of atividadesFala) {
      const id = af.idAtividadeFala ?? af.IdAtividadeFala;
      const exercicios = af.exercicios ?? af.Exercicios ?? [];
      const exercicioIds = exercicios.map((e) => e.idLicaoFala ?? e.IdLicaoFala);

      licoes.push({
        id: `fala-sessao-${id}`,
        licaoId: id,
        atividadeId,
        tipo: "fala",
        tipoSalvar: "fala-sessao",
        titulo: af.nome ?? af.Nome ?? "Atividade de fala",
        descricao: `${exercicioIds.length} exercício${exercicioIds.length === 1 ? "" : "s"} de fala`,
        dificuldade: NIVEL_LABEL[af.nivelDificuldade ?? af.NivelDificuldade] ?? "Básico",
        unidadeNome: nome,
        exercicioIds,
      });
    }

    const alt = unidade.licoesAlternativa ?? unidade.LicoesAlternativa ?? [];
    for (const l of alt) {
      const id = l.idLicaoAlternativa ?? l.IdLicaoAlternativa;
      licoes.push({
        id: `alternativa-${id}`,
        licaoId: id,
        atividadeId,
        tipo: "alternativa",
        tipoSalvar: "alternativa",
        titulo: l.pergunta ?? l.Pergunta ?? `Interpretação — ${nome}`,
        descricao: `Escolha a alternativa correta entre as opções apresentadas.`,
        dificuldade: "Básico",
        unidadeNome: nome,
      });
    }

    const video = unidade.licoesVideo ?? unidade.LicoesVideo ?? [];
    for (const l of video) {
      const id = l.idLicaoVideo ?? l.IdLicaoVideo;
      licoes.push({
        id: `video-${id}`,
        licaoId: id,
        atividadeId,
        tipo: "video",
        tipoSalvar: "video",
        titulo: l.titulo ?? l.Titulo ?? `Vídeo — ${nome}`,
        descricao:
          l.videoDescricao ?? l.VideoDescricao ?? "Assista e aprenda com o vídeo.",
        dificuldade: "Iniciante",
        unidadeNome: nome,
      });
    }
  }

  return licoes;
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

    if (concluidos === chaves.length) {
      return { statusItem: "Realizada", progressoPct: 100 };
    }
    if (iniciados > 0) {
      return { statusItem: "Em andamento", progressoPct: Math.round((concluidos / chaves.length) * 100) };
    }
    return { statusItem: "Não iniciada", progressoPct: 0 };
  }

  if (progressoIds.concluidas.has(item.id)) return { statusItem: "Realizada", progressoPct: 100 };
  if (progressoIds.emAndamento.has(item.id)) return { statusItem: "Em andamento", progressoPct: 50 };
  return { statusItem: "Não iniciada", progressoPct: 0 };
}


export function useTelaInicioAtividades() {
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [dificuldade, setDificuldade] = useState([]);
  const [status, setStatus] = useState([]);

  const [todasLicoes, setTodasLicoes] = useState([]);
  const [progressoIds, setProgressoIds] = useState({ emAndamento: new Set(), concluidas: new Set() });
  const [carregando, setCarregando] = useState(true);
  const [nivelUsuario, setNivelUsuario] = useState("");

  // contadores para os cards "Seu Progresso"
  const [qtdRealizadas, setQtdRealizadas] = useState(0);
  const [qtdEmAndamento, setQtdEmAndamento] = useState(0);

  // IDs das atividades (de topo) salvas pelo usuário — usado para marcar o bookmark
  const [atividadesSalvasIds, setAtividadesSalvasIds] = useState(new Set());

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const alternarItem = (valor, lista, setLista) => {
    setLista(lista.includes(valor) ? lista.filter((i) => i !== valor) : [...lista, valor]);
  };

  useEffect(() => {
    async function carregar() {
      setCarregando(true);

      // 1. Busca unidades e lições
      const resUnidades = await listarUnidades();
      if (resUnidades.sucesso) {
        setTodasLicoes(extrairLicoes(resUnidades.data));
      }

      // 2. Busca progresso do usuário logado
      const usuarioId = localStorage.getItem("id");
      if (usuarioId) {
        const resUsuario = await buscarUsuario(usuarioId);
        if (resUsuario.sucesso) {
          const nivel = resUsuario.data.nivelDificuldade ?? resUsuario.data.NivelDificuldade;
          setNivelUsuario(NIVEL_LABEL[nivel] ?? nivel ?? "");
        }

        try {
          const res = await api.get(`/Progresso/usuario/${usuarioId}`);
          const data = res.data;

          const emAndamento = new Set();
          const concluidas = new Set();

          // Alternativas em andamento/concluídas
          for (const p of data?.Alternativas ?? data?.alternativas ?? []) {
            const chave = `alternativa-${p.LicaoAlternativaId ?? p.licaoAlternativaId}`;
            const st = p.Status ?? p.status;
            if (st === "EmAndamento" || st === 1) emAndamento.add(chave);
            if (st === "Concluido" || st === 2) concluidas.add(chave);
          }

          // Falas em andamento/concluídas
          for (const p of data?.Falas ?? data?.falas ?? []) {
            const chave = `fala-${p.LicaoFalaId ?? p.licaoFalaId}`;
            const st = p.Status ?? p.status;
            if (st === "EmAndamento" || st === 1) emAndamento.add(chave);
            if (st === "Concluido" || st === 2) concluidas.add(chave);
          }

          // Vídeos concluídos
          for (const p of data?.Videos ?? data?.videos ?? []) {
            const chave = `video-${p.LicaoVideoId ?? p.licaoVideoId}`;
            const st = p.Status ?? p.status;
            if (st === "Concluido" || st === 2) concluidas.add(chave);
          }

          setProgressoIds({ emAndamento, concluidas });
          setQtdRealizadas(concluidas.size);
          setQtdEmAndamento(emAndamento.size);
        } catch {
          // progresso indisponível — trata tudo como "recomendada"
        }

        // 3. Busca itens salvos para o contador
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

  const toggleSalvar = async (atividade, novoEstado) => {
    const tipoItem = atividade.tipoSalvar ?? atividade.tipo;
    const itemId = atividade.licaoId;
    const chave = `${tipoItem}:${itemId}`;

    if (novoEstado) {
      const res = await salvarItem(tipoItem, itemId);
      if (res.sucesso) {
        setAtividadesSalvasIds((prev) => new Set([...prev, chave]));
      }
    } else {
      const res = await dessalvarItem(tipoItem, itemId);
      if (res.sucesso) {
        setAtividadesSalvasIds((prev) => {
          const copia = new Set(prev);
          copia.delete(chave);
          return copia;
        });
      }
    }
  };

  const atividadesFiltradas = useMemo(() => {
    const termo = busca.toLowerCase();

    return todasLicoes
      .filter((l) => {
        const batePesquisa = l.titulo.toLowerCase().includes(termo);

        // Sem filtro manual de dificuldade escolhido: mostra só o nível do próprio usuário.
        // Com filtro manual: respeita a escolha explícita do usuário.
        const bateDificuldade =
          dificuldade.length > 0
            ? dificuldade.includes(l.dificuldade)
            : !nivelUsuario || l.dificuldade === nivelUsuario;

        const { statusItem } = calcularProgressoItem(l, progressoIds);
        const bateStatus = status.length === 0 || status.includes(statusItem);

        return batePesquisa && bateDificuldade && bateStatus;
      })
      .map((l) => {
        const { statusItem, progressoPct } = calcularProgressoItem(l, progressoIds);
        const categoria = statusItem === "Em andamento" ? "continuar" : "recomendada";

        return { ...l, categoria, progresso: progressoPct };
      });
  }, [todasLicoes, progressoIds, busca, dificuldade, status, nivelUsuario]);

  const qtdSalvas = atividadesSalvasIds.size;

  return {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    busca,
    setBusca,
    dificuldade,
    setDificuldade,
    status,
    setStatus,
    alternarItem,
    atividadesFiltradas,
    carregando,
    qtdRealizadas,
    qtdSalvas,
    qtdEmAndamento,
    atividadesSalvasIds,
    toggleSalvar,
  };
}
