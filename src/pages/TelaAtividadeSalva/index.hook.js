import { useState } from "react";
import { ATIVIDADES_SALVAS_MOCK } from "./utils";
 
export function useTelaAtividadeSalva() {
  const [atividades, setAtividades] = useState(ATIVIDADES_SALVAS_MOCK);
 
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
 