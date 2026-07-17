import { useState, useCallback } from "react";
import { clampProgresso } from "./InfoAtividades.utils";

export function useInfoAtividade({
  progresso,
  salvaInicial = false,
  onAvancar,
  onToggleSalvar,
  onEditar,
  onExcluir,
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

  const handleEditar = useCallback(
    (event) => {
      event.stopPropagation();
      onEditar?.();
    },
    [onEditar]
  );

  const handleExcluir = useCallback(
    (event) => {
      event.stopPropagation();
      onExcluir?.();
    },
    [onExcluir]
  );

  return {
    salva,
    progressoSeguro,
    handleToggleBookmark,
    handleAvancar,
    handleEditar,
    handleExcluir,
  };
}