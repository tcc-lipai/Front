import { useState } from "react";

export function useNavbar() {
  const [drawerAberto, setDrawerAberto] = useState(false);

  const abrirDrawer = () => setDrawerAberto(true);
  const fecharDrawer = () => setDrawerAberto(false);

  return { drawerAberto, abrirDrawer, fecharDrawer };
}