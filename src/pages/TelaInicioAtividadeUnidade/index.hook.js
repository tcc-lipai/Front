import { useCallback, useEffect, useState } from "react";
import { listarUnidadesResumo, buscarUnidade } from "../../services/unidadeService";
import { buscarUsuario, valorNivelDificuldade, nomeNivelDificuldade } from "../../services/usuarioService";
import {
  buscarDesempenhoPorUnidade,
  buscarElegibilidadeNivel,
  subirNivel as subirNivelServico,
} from "../../services/progressoService";
import api from "../../services/api";

function lista(objeto, ...nomes) {
  for (const nome of nomes) {
    if (Array.isArray(objeto?.[nome])) return objeto[nome];
  }
  return [];
}

function extrairFonema(nomeUnidade) {
  const match = /fonema\s+([a-z])/i.exec(nomeUnidade || "");
  return match ? match[1].toUpperCase() : null;
}

/** true se o conteúdo (nivelItem) está liberado pro nível do usuário (acesso cumulativo). */
function nivelLiberado(nivelItem, nivelUsuario) {
  const nivel = valorNivelDificuldade(nivelItem);
  if (nivel == null || nivelUsuario == null) return true;
  return nivelUsuario >= nivel;
}

function normalizarUnidade(unidade, concluidas, nivelUsuario, desempenho) {
  const todasFala = lista(unidade, "licoesFala", "LicoesFala");
  const falaAvulsa = todasFala.filter(
    (l) =>
      (l.atividadeFalaId ?? l.AtividadeFalaId ?? null) == null &&
      nivelLiberado(l.nivelDificuldade ?? l.NivelDificuldade, nivelUsuario)
  );

  const vibracao = lista(unidade, "licoesVibracao", "LicoesVibracao").map((l) => {
    const id = l.idLicaoVibracao ?? l.IdLicaoVibracao;
    return {
      id,
      texto: l.silaba ?? l.Silaba ?? "Sílaba",
      concluida: concluidas.vibracao.has(id),
    };
  });

  const video = lista(unidade, "licoesVideo", "LicoesVideo")
    .filter((l) => nivelLiberado(l.nivelDificuldade ?? l.NivelDificuldade, nivelUsuario))
    .map((l) => {
      const id = l.idLicaoVideo ?? l.IdLicaoVideo;
      return {
        id,
        texto: l.titulo ?? l.Titulo ?? "Vídeo-aula",
        concluida: concluidas.video.has(id),
      };
    });

  const alternativa = lista(unidade, "licoesAlternativa", "LicoesAlternativa")
    .filter((l) => nivelLiberado(l.nivelDificuldade ?? l.NivelDificuldade, nivelUsuario))
    .map((l) => {
      const id = l.idLicaoAlternativa ?? l.IdLicaoAlternativa;
      return {
        id,
        texto: l.pergunta ?? l.Pergunta ?? "Exercício de interpretação",
        concluida: concluidas.alternativa.has(id),
        acerto: concluidas.alternativa.get(id) ?? null,
      };
    });

  const fala = falaAvulsa.map((l) => {
    const id = l.idLicaoFala ?? l.IdLicaoFala;
    return {
      id,
      texto: l.fraseEsperada ?? l.FraseEsperada ?? "Exercício de fala",
      concluida: concluidas.fala.has(id),
      acerto: concluidas.fala.get(id) ?? null,
    };
  });

  const atividadesFala = lista(unidade, "atividadesFala", "AtividadesFala")
    .filter((af) => nivelLiberado(af.nivelDificuldade ?? af.NivelDificuldade, nivelUsuario))
    .map((af) => {
      const exercicios = lista(af, "exercicios", "Exercicios");
      const idsExercicios = exercicios.map((e) => e.idLicaoFala ?? e.IdLicaoFala);
      const scores = idsExercicios
        .map((id) => concluidas.fala.get(id))
        .filter((score) => score != null);
      return {
        id: af.idAtividadeFala ?? af.IdAtividadeFala,
        nome: af.nome ?? af.Nome ?? "Atividade de fala",
        nivel: nomeNivelDificuldade(af.nivelDificuldade ?? af.NivelDificuldade),
        totalExercicios: idsExercicios.length,
        concluida:
          idsExercicios.length > 0 && idsExercicios.every((id) => concluidas.fala.has(id)),
        acerto:
          scores.length > 0 ? scores.reduce((soma, s) => soma + s, 0) / scores.length : null,
      };
    });

  const nome = unidade.nome ?? unidade.Nome ?? "Unidade";
  const temAlgumConcluido =
    vibracao.some((v) => v.concluida) ||
    video.some((v) => v.concluida) ||
    alternativa.some((v) => v.concluida) ||
    fala.some((v) => v.concluida) ||
    atividadesFala.some((v) => v.concluida);

  return {
    id: unidade.idUnidade ?? unidade.IdUnidade,
    nome,
    fonema: extrairFonema(nome),
    primeiraVez: !temAlgumConcluido,
    vibracao,
    fala,
    atividadesFala,
    video,
    alternativa,
    desempenho: desempenho ?? null,
  };
}

/**
 * Busca o que a tela precisa pra listar as unidades SEM trazer o conteúdo delas:
 * nível, elegibilidade, resumo (nomes) e o progresso/desempenho do aluno. O
 * conteúdo de cada unidade só é baixado quando ela é aberta (buscarUnidade).
 */
async function buscarBase() {
  const usuarioId = localStorage.getItem("id");

  let nivel = null;
  if (usuarioId) {
    const resUsuario = await buscarUsuario(usuarioId);
    if (resUsuario.sucesso) {
      nivel = valorNivelDificuldade(
        resUsuario.data.nivelDificuldade ?? resUsuario.data.NivelDificuldade
      );
    }
  }

  const [resumo, resDesempenho, resElegibilidade] = await Promise.all([
    listarUnidadesResumo(),
    usuarioId ? buscarDesempenhoPorUnidade(usuarioId) : Promise.resolve({ sucesso: false, data: [] }),
    buscarElegibilidadeNivel(),
  ]);

  if (!resumo.sucesso) {
    return { erro: resumo.mensagem };
  }

  const desempenhoPorUnidade = new Map();
  if (resDesempenho.sucesso) {
    for (const d of resDesempenho.data) {
      desempenhoPorUnidade.set(d.unidadeId ?? d.UnidadeId, d);
    }
  }

  const concluidas = {
    alternativa: new Map(),
    fala: new Map(),
    video: new Set(),
    vibracao: new Set(),
  };

  if (usuarioId) {
    try {
      const res = await api.get(`/Progresso/usuario/${usuarioId}`);
      const data = res.data;

      for (const p of data?.Alternativas ?? data?.alternativas ?? []) {
        const status = p.Status ?? p.status;
        const correta = p.Correta ?? p.correta;
        if ((status === "Concluido" || status === 2) && correta) {
          concluidas.alternativa.set(p.LicaoAlternativaId ?? p.licaoAlternativaId, 100);
        }
      }
      for (const p of data?.Falas ?? data?.falas ?? []) {
        const status = p.Status ?? p.status;
        const correta = p.Correta ?? p.correta;
        if ((status === "Concluido" || status === 2) && correta) {
          const score = p.ScoreAcustico ?? p.scoreAcustico;
          concluidas.fala.set(p.LicaoFalaId ?? p.licaoFalaId, score != null ? Math.round(score) : 100);
        }
      }
      for (const p of data?.Videos ?? data?.videos ?? []) {
        const status = p.Status ?? p.status;
        if (status === "Concluido" || status === 2) {
          concluidas.video.add(p.LicaoVideoId ?? p.licaoVideoId);
        }
      }
      for (const p of data?.Vibracoes ?? data?.vibracoes ?? []) {
        const status = p.Status ?? p.status;
        if (status === "Concluido" || status === 2) {
          concluidas.vibracao.add(p.LicaoVibracaoId ?? p.licaoVibracaoId);
        }
      }
    } catch {
      // progresso indisponível — segue sem marcar nada como concluído
    }
  }

  return {
    nivel,
    elegibilidade: resElegibilidade.sucesso ? resElegibilidade.data : null,
    resumo: resumo.data.map((u) => ({
      id: u.idUnidade ?? u.IdUnidade,
      nome: u.nome ?? u.Nome ?? "Unidade",
    })),
    concluidas,
    desempenhoPorUnidade,
  };
}

export function useTelaInicioAtividadeUnidade() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [base, setBase] = useState(null);
  // conteúdo já baixado de cada unidade aberta: { [id]: { carregando } | { erro } | { dados } }
  const [detalhes, setDetalhes] = useState({});
  const [abertas, setAbertas] = useState(() => new Set());
  const [dica, setDica] = useState(null);
  const [subindoNivel, setSubindoNivel] = useState(false);
  const [resultadoNivel, setResultadoNivel] = useState(null);

  const carregarUnidade = useCallback(async (idUnidade, baseAtual) => {
    setDetalhes((atual) => ({ ...atual, [idUnidade]: { carregando: true } }));
    const res = await buscarUnidade(idUnidade);
    setDetalhes((atual) => ({
      ...atual,
      [idUnidade]: res.sucesso
        ? {
            dados: normalizarUnidade(
              res.data,
              baseAtual.concluidas,
              baseAtual.nivel,
              baseAtual.desempenhoPorUnidade.get(idUnidade)
            ),
          }
        : { erro: res.mensagem },
    }));
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const dados = await buscarBase();
      if (!ativo) return;

      if (dados.erro) {
        setErro(dados.erro);
        setCarregando(false);
        return;
      }

      setBase(dados);
      setCarregando(false);

      // abre só a primeira unidade; as outras são baixadas quando o aluno abrir
      const primeira = dados.resumo[0]?.id;
      if (primeira != null) {
        setAbertas(new Set([primeira]));
        carregarUnidade(primeira, dados);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [carregarUnidade]);

  function alternarUnidade(idUnidade) {
    const jaAberta = abertas.has(idUnidade);
    setAbertas((atual) => {
      const novo = new Set(atual);
      if (jaAberta) novo.delete(idUnidade);
      else novo.add(idUnidade);
      return novo;
    });
    if (!jaAberta && !detalhes[idUnidade]?.dados && base) {
      carregarUnidade(idUnidade, base);
    }
  }

  const unidades = (base?.resumo ?? []).map((u) => ({
    id: u.id,
    nome: u.nome,
    aberta: abertas.has(u.id),
    ...(detalhes[u.id] ?? {}),
  }));

  // se for a primeira vez do usuário na unidade, mostra a dica do fonema antes
  // de deixar ele abrir a atividade de verdade
  function comecarComDica(unidade, aoComecar) {
    if (unidade.primeiraVez && unidade.fonema) {
      setDica({ fonema: unidade.fonema, aoContinuar: aoComecar });
      return;
    }
    aoComecar();
  }

  function fecharDica() {
    setDica(null);
  }

  async function confirmarSubirNivel() {
    setSubindoNivel(true);
    const res = await subirNivelServico();

    if (!res.sucesso) {
      setSubindoNivel(false);
      setResultadoNivel({ sucesso: false, mensagem: res.mensagem });
      return;
    }

    setResultadoNivel({ sucesso: true, novoNivel: res.data.novoNivel ?? res.data.NovoNivel });

    const dados = await buscarBase();
    setSubindoNivel(false);
    if (dados.erro) return;
    setBase(dados);
    // o nível mudou: o que cada unidade mostra muda junto, então rebaixa só as abertas
    setDetalhes({});
    abertas.forEach((id) => carregarUnidade(id, dados));
  }

  function fecharResultadoNivel() {
    setResultadoNivel(null);
  }

  return {
    carregando,
    erro,
    unidades,
    alternarUnidade,
    nivelUsuario: base?.nivel ?? null,
    comecarComDica,
    dica,
    fecharDica,
    elegibilidade: base?.elegibilidade ?? null,
    subindoNivel,
    confirmarSubirNivel,
    resultadoNivel,
    fecharResultadoNivel,
  };
}
