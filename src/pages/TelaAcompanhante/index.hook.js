import { useState } from "react";

export function useTelaAcompanhante() {
  const [drawerAberto, setDrawerAberto] = useState(false);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  return {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
  };
}
