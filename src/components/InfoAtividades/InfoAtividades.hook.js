// InfoAtividades.hook.js
// Hook responsável por toda a lógica/estado do card InfoAtividade.
// Hoje funciona 100% local (sem back). Quando a API estiver pronta,
// é só trocar o setBookmarked local por uma chamada de API dentro
// de handleToggleBookmark, mantendo o restante do componente intacto.
//
// NOVO: handleEditar e handleExcluir foram adicionados para dar suporte
// ao modoAdmin do componente (tela de Admin). Eles não afetam em nada
// o comportamento das telas que já usavam o componente, pois só são
// chamados pelos botões que aparecem quando modoAdmin={true}.

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