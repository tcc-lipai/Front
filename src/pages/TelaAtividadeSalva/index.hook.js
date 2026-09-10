import { useState } from "react";
import { TODAS_ATIVIDADES_MOCK } from "./index.utils";

export function useTelaAtividadeSalva() {
  const [atividades, setAtividades] = useState(TODAS_ATIVIDADES_MOCK);

  const handleToggleSalvar = (id) => (novoValor) => {
    if (!novoValor) {
      setAtividades((atual) => atual.filter((a) => a.id !== id));
    }
  };

  const handleAvancar = (id) => () => {
    console.log("Navegar para atividade:", id);
  };

  return { atividades, handleToggleSalvar, handleAvancar };
}
