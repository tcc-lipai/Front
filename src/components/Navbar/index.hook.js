// index.hook.js
// Lógica da Navbar: controla a abertura/fechamento do NavbarDrawer
// (o menu mobile, acionado pelo botão hambúrguer que só aparece em
// telas pequenas — ver a media query em index.css).

import { useState } from "react";

export function useNavbar() {
  const [drawerAberto, setDrawerAberto] = useState(false);

  const abrirDrawer = () => setDrawerAberto(true);
  const fecharDrawer = () => setDrawerAberto(false);

  return { drawerAberto, abrirDrawer, fecharDrawer };
}