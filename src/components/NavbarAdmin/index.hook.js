import { useState } from "react";

export function useNavbarProfissional() {
  const [drawerAberto, setDrawerAberto] = useState(false);

  const abrirDrawer = () => setDrawerAberto(true);
  const fecharDrawer = () => setDrawerAberto(false);

  return { drawerAberto, abrirDrawer, fecharDrawer };
}
