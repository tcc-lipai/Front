import { useState, useCallback, useEffect } from "react";
import { clampProgresso } from "./index.utils";

export function useInfoAtividade({
  progresso,
  salvaInicial = false,
  onAvancar,
  onToggleSalvar,
  onEditar,
  onExcluir,
}) {
  const [salva, setSalva] = useState(salvaInicial);

  useEffect(() => {
    setSalva(salvaInicial);
  }, [salvaInicial]);

  const progressoSeguro = clampProgresso(progresso);

  const handleToggleBookmark = useCallback(
    (event) => {
      event.stopPropagation();
      const novoValor = !salva;
      setSalva(novoValor);
      onToggleSalvar?.(novoValor);
    },
    [salva, onToggleSalvar]
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
