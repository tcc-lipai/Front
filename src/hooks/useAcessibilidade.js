import { useContext } from "react";
import { AcessibilidadeContext } from "../components/AcessibilidadeProvider/themeContext";

export function useAcessibilidade() {
  const context = useContext(AcessibilidadeContext);

  if (!context) {
    throw new Error("useAcessibilidade deve ser utilizado dentro de AcessibilidadeProvider");
  }

  return context;
}
