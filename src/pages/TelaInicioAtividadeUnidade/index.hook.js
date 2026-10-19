import { useEffect, useState } from "react";
import { listarUnidades } from "../../services/unidadeService";
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

/** Busca tudo que a tela precisa (sem tocar em estado do React). */
async function buscarDadosTela() {
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

  const [resultado, resDesempenho, resElegibilidade] = await Promise.all([
    listarUnidades(),
    usuarioId ? buscarDesempenhoPorUnidade(usuarioId) : Promise.resolve({ sucesso: false, data: [] }),
    buscarElegibilidadeNivel(),
  ]);

  if (!resultado.sucesso) {
    return { erro: resultado.mensagem };
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
    unidades: resultado.data.map((u) =>
      normalizarUnidade(u, concluidas, nivel, desempenhoPorUnidade.get(u.idUnidade ?? u.IdUnidade))
    ),
  };
}

export function useTelaInicioAtividadeUnidade() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [nivelUsuario, setNivelUsuario] = useState(null);
  const [dica, setDica] = useState(null);
  const [elegibilidade, setElegibilidade] = useState(null);
  const [subindoNivel, setSubindoNivel] = useState(false);
  const [resultadoNivel, setResultadoNivel] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const dados = await buscarDadosTela();
      if (!ativo) return;

      if (dados.erro) {
        setErro(dados.erro);
        setCarregando(false);
        return;
      }

      setNivelUsuario(dados.nivel);
      setElegibilidade(dados.elegibilidade);
      setUnidades(dados.unidades);
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

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

    const dados = await buscarDadosTela();
    setSubindoNivel(false);
    if (dados.erro) return;
    setNivelUsuario(dados.nivel);
    setElegibilidade(dados.elegibilidade);
    setUnidades(dados.unidades);
  }

  function fecharResultadoNivel() {
    setResultadoNivel(null);
  }

  return {
    carregando,
    erro,
    unidades,
    nivelUsuario,
    comecarComDica,
    dica,
    fecharDica,
    elegibilidade,
    subindoNivel,
    confirmarSubirNivel,
    resultadoNivel,
    fecharResultadoNivel,
  };
}
