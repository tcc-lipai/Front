// InfoAtividade.hook.js
// Hook responsável por toda a lógica/estado do card InfoAtividade.
// Hoje funciona 100% local (sem back). Quando a API estiver pronta,
// é só trocar o setBookmarked local por uma chamada de API dentro
// de handleToggleBookmark, mantendo o restante do componente intacto.

import { useState, useCallback } from "react";
import { clampProgresso } from "./InfoAtividades.utils";

export function useInfoAtividade({
  progresso,
  salvaInicial = false,
  onAvancar,
  onToggleSalvar,
}) {
  const [salva, setSalva] = useState(salvaInicial);

  const progressoSeguro = clampProgresso(progresso);

  const handleToggleBookmark = useCallback(
    (event) => {
      event.stopPropagation();
      setSalva((atual) => {
        const novoValor = !atual;
        onToggleSalvar?.(novoValor);
        return novoValor;
      });
    },
    [onToggleSalvar]
  );

  const handleAvancar = useCallback(() => {
    onAvancar?.();
  }, [onAvancar]);

  return {
    salva,
    progressoSeguro,
    handleToggleBookmark,
    handleAvancar,
  };
}