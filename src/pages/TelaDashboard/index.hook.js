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
  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState([]);

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
        const unidades = unidadesRes.data.map((unidade) => {
          const falaAvulsa = lista(unidade, "licoesFala", "LicoesFala").filter(
            (l) => (l.atividadeFalaId ?? l.AtividadeFalaId ?? null) == null
          ).length;
          const atividadesFala = lista(unidade, "atividadesFala", "AtividadesFala").length;
          const alternativa = lista(unidade, "licoesAlternativa", "LicoesAlternativa").length;
          const video = lista(unidade, "licoesVideo", "LicoesVideo").length;

          return {
            id: unidade.idUnidade ?? unidade.IdUnidade,
            nome: unidade.nome ?? unidade.Nome ?? "Unidade",
            totalAtividades: falaAvulsa + atividadesFala + alternativa + video,
          };
        });
        setUnidadesDisponiveis(unidades);
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
    unidadesDisponiveis,
  };
}
