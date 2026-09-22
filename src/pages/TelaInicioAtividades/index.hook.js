import { useState, useEffect, useMemo } from "react";
import { listarUnidades } from "../../services/unidadeService";
import { salvarAtividade, dessalvarAtividade } from "../../services/atividadeService";
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

    const fala = unidade.licoesFala ?? unidade.LicoesFala ?? [];
    for (const l of fala) {
      const id = l.idLicaoFala ?? l.IdLicaoFala;
      licoes.push({
        id: `fala-${id}`,
        licaoId: id,
        atividadeId,
        tipo: "fala",
        titulo: `Fala: ${l.fraseEsperada ?? l.FraseEsperada ?? nome}`,
        descricao: `Pratique a pronúncia da frase "${l.fraseEsperada ?? l.FraseEsperada ?? ""}"`,
        dificuldade:
          NIVEL_LABEL[l.nivelDificuldade ?? l.NivelDificuldade] ?? "Básico",
        unidadeNome: nome,
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


export function useTelaInicioAtividades() {
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [dificuldade, setDificuldade] = useState([]);
  const [status, setStatus] = useState([]);

  const [todasLicoes, setTodasLicoes] = useState([]);
  const [progressoIds, setProgressoIds] = useState({ emAndamento: new Set(), concluidas: new Set() });
  const [carregando, setCarregando] = useState(true);

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

        // 3. Busca atividades salvas para o contador
        try {
          const resSalvas = await api.get("/Atividades/salvas");
          const salvas = Array.isArray(resSalvas.data) ? resSalvas.data : [];
          // guarda os IDs das atividades (de topo) salvas
          const idsSet = new Set(
            salvas.map((s) => s.idAtividade ?? s.IdAtividade ?? s.atividadeId ?? s.AtividadeId)
          );
          setAtividadesSalvasIds(idsSet);
        } catch {
          // ignora se falhar
        }
      }

      setCarregando(false);
    }

    carregar();
  }, []);

  /**
   * Alterna salvar/dessalvar uma lição.
   * Nota: o backend salva por Atividade de topo (não por lição).
   * Aqui usamos o licaoId como atividadeId provisório — se o back expõe
   * o atividadeId na listagem de unidades, use esse valor.
   */
  const toggleSalvar = async (atividade, novoEstado) => {
    // Cada lição pertence a uma unidade que pertence a uma Atividade.
    // O backend salva por atividadeId (topo). Por ora usamos licaoId como proxy
    // se não tivermos o atividadeId diretamente.
    const atividadeId = atividade.atividadeId ?? atividade.licaoId;

    if (novoEstado) {
      const res = await salvarAtividade(atividadeId);
      if (res.sucesso) {
        setAtividadesSalvasIds((prev) => new Set([...prev, atividadeId]));
      }
    } else {
      const res = await dessalvarAtividade(atividadeId);
      if (res.sucesso) {
        setAtividadesSalvasIds((prev) => {
          const copia = new Set(prev);
          copia.delete(atividadeId);
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

        const bateDificuldade =
          dificuldade.length === 0 || dificuldade.includes(l.dificuldade);

        let statusItem = "Não iniciada";
        if (progressoIds.concluidas.has(l.id)) statusItem = "Concluída";
        else if (progressoIds.emAndamento.has(l.id)) statusItem = "Em andamento";

        const bateStatus = status.length === 0 || status.includes(statusItem);

        return batePesquisa && bateDificuldade && bateStatus;
      })
      .map((l) => {
        let categoria = "recomendada";
        if (progressoIds.emAndamento.has(l.id)) categoria = "continuar";

        let progressoPct = 0;
        if (progressoIds.emAndamento.has(l.id)) progressoPct = 50;
        if (progressoIds.concluidas.has(l.id)) progressoPct = 100;

        return { ...l, categoria, progresso: progressoPct };
      });
  }, [todasLicoes, progressoIds, busca, dificuldade, status]);

  // Calcula a quantidade real de cards (lições) que vão ficar com o bookmark roxo
  const qtdSalvas = useMemo(() => {
    return todasLicoes.filter((l) => atividadesSalvasIds.has(l.atividadeId ?? l.licaoId)).length;
  }, [todasLicoes, atividadesSalvasIds]);

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
