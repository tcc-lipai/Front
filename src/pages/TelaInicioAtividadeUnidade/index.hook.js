import { useEffect, useState } from "react";
import { listarUnidades } from "../../services/unidadeService";
import api from "../../services/api";

function lista(objeto, ...nomes) {
  for (const nome of nomes) {
    if (Array.isArray(objeto?.[nome])) return objeto[nome];
  }
  return [];
}

function normalizarUnidade(unidade, concluidas) {
  const todasFala = lista(unidade, "licoesFala", "LicoesFala");
  const falaAvulsa = todasFala.filter(
    (l) => (l.atividadeFalaId ?? l.AtividadeFalaId ?? null) == null
  );

  return {
    id: unidade.idUnidade ?? unidade.IdUnidade,
    nome: unidade.nome ?? unidade.Nome ?? "Unidade",
    fala: falaAvulsa.map((l) => {
      const id = l.idLicaoFala ?? l.IdLicaoFala;
      return {
        id,
        texto: l.fraseEsperada ?? l.FraseEsperada ?? "Exercício de fala",
        concluida: concluidas.fala.has(id),
      };
    }),
    atividadesFala: lista(unidade, "atividadesFala", "AtividadesFala").map((af) => {
      const exercicios = lista(af, "exercicios", "Exercicios");
      const idsExercicios = exercicios.map((e) => e.idLicaoFala ?? e.IdLicaoFala);
      return {
        id: af.idAtividadeFala ?? af.IdAtividadeFala,
        nome: af.nome ?? af.Nome ?? "Atividade de fala",
        totalExercicios: idsExercicios.length,
        concluida:
          idsExercicios.length > 0 && idsExercicios.every((id) => concluidas.fala.has(id)),
      };
    }),
    video: lista(unidade, "licoesVideo", "LicoesVideo").map((l) => {
      const id = l.idLicaoVideo ?? l.IdLicaoVideo;
      return {
        id,
        texto: l.titulo ?? l.Titulo ?? "Vídeo-aula",
        concluida: concluidas.video.has(id),
      };
    }),
    alternativa: lista(unidade, "licoesAlternativa", "LicoesAlternativa").map((l) => {
      const id = l.idLicaoAlternativa ?? l.IdLicaoAlternativa;
      return {
        id,
        texto: l.pergunta ?? l.Pergunta ?? "Exercício de interpretação",
        concluida: concluidas.alternativa.has(id),
      };
    }),
  };
}

export function useTelaInicioAtividadeUnidade() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const resultado = await listarUnidades();
      if (!ativo) return;

      if (!resultado.sucesso) {
        setErro(resultado.mensagem);
        setCarregando(false);
        return;
      }

      const concluidas = { alternativa: new Set(), fala: new Set(), video: new Set() };
      const usuarioId = localStorage.getItem("id");
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

  return { carregando, erro, unidades };
}
