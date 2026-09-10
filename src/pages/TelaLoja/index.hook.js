import { useMemo, useState } from "react";
import { ITENS_LOJA_MOCK, filtrarItensPorBusca } from "./index.utils";

export function useTelaLoja() {
  const [busca, setBusca] = useState("");
  const [drawerAberto, setDrawerAberto] = useState(false);

  // Filtro memoizado por termo de pesquisa
  const itensFiltrados = useMemo(() => filtrarItensPorBusca(ITENS_LOJA_MOCK, busca), [busca]);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const handleComprar = (item) => {
    if (item.isBlocked) {
      alert(`O item "${item.title}" está bloqueado.`);
      return;
    }
    console.log("Item comprado com sucesso:", item);
  };

  return {
    busca,
    setBusca,
    itensFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    handleComprar,
  };
}
