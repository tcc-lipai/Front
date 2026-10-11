import { useEffect, useState } from "react";
import { listarUnidades } from "../../services/unidadeService";
import { buscarUsuario, valorNivelDificuldade } from "../../services/usuarioService";
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

function normalizarUnidade(unidade, concluidas) {
  const todasFala = lista(unidade, "licoesFala", "LicoesFala");
  const falaAvulsa = todasFala.filter(
    (l) => (l.atividadeFalaId ?? l.AtividadeFalaId ?? null) == null
  );

  const vibracao = lista(unidade, "licoesVibracao", "LicoesVibracao").map((l) => {
    const id = l.idLicaoVibracao ?? l.IdLicaoVibracao;
    return {
      id,
      texto: l.silaba ?? l.Silaba ?? "Sílaba",
      concluida: concluidas.vibracao.has(id),
    };
  });

  const video = lista(unidade, "licoesVideo", "LicoesVideo").map((l) => {
    const id = l.idLicaoVideo ?? l.IdLicaoVideo;
    return {
      id,
      texto: l.titulo ?? l.Titulo ?? "Vídeo-aula",
      concluida: concluidas.video.has(id),
    };
  });

  const alternativa = lista(unidade, "licoesAlternativa", "LicoesAlternativa").map((l) => {
    const id = l.idLicaoAlternativa ?? l.IdLicaoAlternativa;
    return {
      id,
      texto: l.pergunta ?? l.Pergunta ?? "Exercício de interpretação",
      concluida: concluidas.alternativa.has(id),
    };
  });

  const fala = falaAvulsa.map((l) => {
    const id = l.idLicaoFala ?? l.IdLicaoFala;
    return {
      id,
      texto: l.fraseEsperada ?? l.FraseEsperada ?? "Exercício de fala",
      concluida: concluidas.fala.has(id),
    };
  });

  const atividadesFala = lista(unidade, "atividadesFala", "AtividadesFala").map((af) => {
    const exercicios = lista(af, "exercicios", "Exercicios");
    const idsExercicios = exercicios.map((e) => e.idLicaoFala ?? e.IdLicaoFala);
    return {
      id: af.idAtividadeFala ?? af.IdAtividadeFala,
      nome: af.nome ?? af.Nome ?? "Atividade de fala",
      totalExercicios: idsExercicios.length,
      concluida:
        idsExercicios.length > 0 && idsExercicios.every((id) => concluidas.fala.has(id)),
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
  };
}

export function useTelaInicioAtividadeUnidade() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [podeOutrosTipos, setPodeOutrosTipos] = useState(true);
  const [podeVibracao, setPodeVibracao] = useState(true);
  const [dica, setDica] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
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
      if (!ativo) return;
      // Iniciante (1) só acompanhante; Básico (2) em diante libera o resto também
      setPodeOutrosTipos(nivel !== 1);
      setPodeVibracao(nivel === 1 || nivel === 2 || nivel == null);

      const resultado = await listarUnidades();
      if (!ativo) return;

      if (!resultado.sucesso) {
        setErro(resultado.mensagem);
        setCarregando(false);
        return;
      }

      const concluidas = {
        alternativa: new Set(),
        fala: new Set(),
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
              concluidas.alternativa.add(p.LicaoAlternativaId ?? p.licaoAlternativaId);
            }
          }
          for (const p of data?.Falas ?? data?.falas ?? []) {
            const status = p.Status ?? p.status;
            const correta = p.Correta ?? p.correta;
            if ((status === "Concluido" || status === 2) && correta) {
              concluidas.fala.add(p.LicaoFalaId ?? p.licaoFalaId);
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

      if (!ativo) return;
      setUnidades(resultado.data.map((u) => normalizarUnidade(u, concluidas)));
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

  return {
    carregando,
    erro,
    unidades,
    podeOutrosTipos,
    podeVibracao,
    comecarComDica,
    dica,
    fecharDica,
  };
}
