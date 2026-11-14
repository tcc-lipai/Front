import { useEffect, useState } from "react";
import { buscarUsuario } from "../../services/usuarioService";
import { buscarDesempenho } from "../../services/progressoService";
import { listarConquistasUsuario } from "../../services/conquistaService";
import { listarUnidadesResumo } from "../../services/unidadeService";
import { getCached, setCached } from "../../utils/apiCache";

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
    const chaveCache = `dashboard:${usuarioId}`;

    function aplicarResultados({ usuarioRes, desempenhoRes, conquistasRes, unidadesRes }) {
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
        const unidades = unidadesRes.data.map((unidade) => ({
          id: unidade.idUnidade ?? unidade.IdUnidade,
          nome: unidade.nome ?? unidade.Nome ?? "Unidade",
          totalAtividades: unidade.totalAtividades ?? unidade.TotalAtividades ?? 0,
        }));
        setUnidadesDisponiveis(unidades);
      }
    }

    async function carregar() {
      const emCache = getCached(chaveCache);
      if (emCache) {
        aplicarResultados(emCache);
        setCarregando(false);
        return;
      }

      const [usuarioRes, desempenhoRes, conquistasRes, unidadesRes] = await Promise.all([
        buscarUsuario(usuarioId),
        buscarDesempenho(usuarioId),
        listarConquistasUsuario(usuarioId),
        listarUnidadesResumo(),
      ]);
      if (!ativo) return;

      const resultados = { usuarioRes, desempenhoRes, conquistasRes, unidadesRes };
      setCached(chaveCache, resultados);
      aplicarResultados(resultados);
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
