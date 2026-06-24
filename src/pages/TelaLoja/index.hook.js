// index.hook.js
// Lógica da TelaLoja: busca/filtro dos itens e abertura/fechamento do
// UserProfileDrawer (acionado pelo botão de perfil do HeaderActions).

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

  // Ainda sem back-end e o ProdutoLoja atual não expõe um onClick/onBuy
  // no botão de preço. Quando ele tiver, é só chamar handleComprar(item)
  // a partir de lá — a lógica de compra já fica pronta aqui.
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