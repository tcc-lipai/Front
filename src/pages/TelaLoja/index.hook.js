import { useMemo, useState } from "react";
import { ITENS_LOJA_MOCK, filtrarItensPorBusca } from "./utils";

export function useTelaLoja() {
  const [busca, setBusca] = useState("");
  const [drawerAberto, setDrawerAberto] = useState(false);

  const itensFiltrados = useMemo(
    () => filtrarItensPorBusca(ITENS_LOJA_MOCK, busca),
    [busca]
  );

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const handleComprar = (item) => {
    console.log("Comprar item:", item);
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