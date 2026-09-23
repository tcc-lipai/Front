import { useEffect, useState } from "react";
import { buscarUsuario } from "../../services/usuarioService";
import { buscarDesempenho } from "../../services/progressoService";
import { listarConquistasUsuario } from "../../services/conquistaService";
import { listarUnidades } from "../../services/unidadeService";

function lista(objeto, ...nomes) {
  for (const nome of nomes) {
    if (Array.isArray(objeto?.[nome])) return objeto[nome];
  }
  return [];
}

export function useTelaDashboard() {
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [desempenho, setDesempenho] = useState({ interpretacao: 0, fala: 0 });
  const [conquistas, setConquistas] = useState([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState([]);

  useEffect(() => {
    let ativo = true;
    const usuarioId = localStorage.getItem("id");

    async function carregar() {
      const [usuarioRes, desempenhoRes, conquistasRes, unidadesRes] = await Promise.all([
        buscarUsuario(usuarioId),
        buscarDesempenho(usuarioId),
        listarConquistasUsuario(usuarioId),
        listarUnidades(),
      ]);
      if (!ativo) return;

      if (usuarioRes.sucesso) setUsuario(usuarioRes.data);

      if (desempenhoRes.sucesso && desempenhoRes.data) {
        setDesempenho({
          interpretacao: desempenhoRes.data.interpretacao ?? desempenhoRes.data.Interpretacao ?? 0,
          fala: desempenhoRes.data.fala ?? desempenhoRes.data.Fala ?? 0,
        });
      }

      if (conquistasRes.sucesso) {
        const atingidas = lista(conquistasRes.data, "atingidas", "Atingidas");
        setConquistas(atingidas.slice(0, 4));
      }

      if (unidadesRes.sucesso) {
        const atividades = [];
        for (const unidade of unidadesRes.data) {
          // Fala avulsa (sem atividade que a agrupe)
          for (const licaoFala of lista(unidade, "licoesFala", "LicoesFala")) {
            if ((licaoFala.atividadeFalaId ?? licaoFala.AtividadeFalaId ?? null) != null) continue;
            atividades.push({
              tipo: "fala",
              id: licaoFala.idLicaoFala ?? licaoFala.IdLicaoFala,
              titulo: `Fale: "${licaoFala.fraseEsperada ?? licaoFala.FraseEsperada}"`,
            });
          }
          // Atividade de fala (sessão com vários exercícios)
          for (const af of lista(unidade, "atividadesFala", "AtividadesFala")) {
            atividades.push({
              tipo: "fala",
              id: af.idAtividadeFala ?? af.IdAtividadeFala,
              titulo: af.nome ?? af.Nome ?? "Atividade de fala",
            });
          }
          for (const licaoAlternativa of lista(unidade, "licoesAlternativa", "LicoesAlternativa")) {
            atividades.push({
              tipo: "alternativa",
              id: licaoAlternativa.idLicaoAlternativa ?? licaoAlternativa.IdLicaoAlternativa,
              titulo: licaoAlternativa.pergunta ?? licaoAlternativa.Pergunta,
            });
          }
          for (const licaoVideo of lista(unidade, "licoesVideo", "LicoesVideo")) {
            atividades.push({
              tipo: "video",
              id: licaoVideo.idLicaoVideo ?? licaoVideo.IdLicaoVideo,
              titulo: licaoVideo.titulo ?? licaoVideo.Titulo,
            });
          }
        }
        setAtividadesRecentes(atividades.slice(0, 6));
      }

      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  return {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    carregando,
    usuario,
    desempenho,
    conquistas,
    atividadesRecentes,
  };
}
