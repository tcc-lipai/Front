import { useEffect, useState } from "react";
import { listarUnidades } from "../../services/unidadeService";

function lista(objeto, ...nomes) {
  for (const nome of nomes) {
    if (Array.isArray(objeto?.[nome])) return objeto[nome];
  }
  return [];
}

function normalizarUnidade(unidade) {
  return {
    id: unidade.idUnidade ?? unidade.IdUnidade,
    nome: unidade.nome ?? unidade.Nome ?? "Unidade",
    fala: lista(unidade, "licoesFala", "LicoesFala").map((l) => ({
      id: l.idLicaoFala ?? l.IdLicaoFala,
      texto: l.fraseEsperada ?? l.FraseEsperada ?? "Exercício de fala",
    })),
    video: lista(unidade, "licoesVideo", "LicoesVideo").map((l) => ({
      id: l.idLicaoVideo ?? l.IdLicaoVideo,
      texto: l.titulo ?? l.Titulo ?? "Vídeo-aula",
    })),
    alternativa: lista(unidade, "licoesAlternativa", "LicoesAlternativa").map((l) => ({
      id: l.idLicaoAlternativa ?? l.IdLicaoAlternativa,
      texto: l.pergunta ?? l.Pergunta ?? "Exercício de interpretação",
    })),
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

      if (resultado.sucesso) {
        setUnidades(resultado.data.map(normalizarUnidade));
      } else {
        setErro(resultado.mensagem);
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return { carregando, erro, unidades };
}
