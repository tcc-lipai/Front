// src/components/Filtro/index.hook.js
import { useState, useCallback } from 'react';

/** @returns {import('./index.types').FiltroState} */
const criarFiltroInicial = () => ({
  busca: '',
  dificuldade: { iniciante: false, intermediario: false, avancado: false },
  status: { realizado: false, emAndamento: false, concluido: false },
});

/**
 * Hook interno do componente Filtro.
 * Gerencia o estado local e notifica o pai via onFiltroChange.
 *
 * @param {(filtro: import('./index.types').FiltroState) => void} onFiltroChange
 * @param {import('./index.types').FiltroState} [valorInicial]
 */
export const useFiltro = (onFiltroChange, valorInicial) => {
  const [filtro, setFiltro] = useState(valorInicial ?? criarFiltroInicial());
  const [aberto, setAberto] = useState(true);

  /** @param {import('./index.types').FiltroState} novoFiltro */
  const _atualizar = useCallback(
    (novoFiltro) => {
      setFiltro(novoFiltro);
      onFiltroChange?.(novoFiltro);
    },
    [onFiltroChange],
  );

  /** @param {string} valor */
  const handleBusca = useCallback(
    (valor) => _atualizar({ ...filtro, busca: valor }),
    [filtro, _atualizar],
  );

  /**
   * @param {'dificuldade' | 'status'} grupo
   * @param {string} chave
   */
  const handleCheckbox = useCallback(
    (grupo, chave) => {
      const novoGrupo = { ...filtro[grupo], [chave]: !filtro[grupo][chave] };
      _atualizar({ ...filtro, [grupo]: novoGrupo });
    },
    [filtro, _atualizar],
  );

  const handleLimpar = useCallback(() => {
    const limpo = criarFiltroInicial();
    setFiltro(limpo);
    onFiltroChange?.(limpo);
  }, [onFiltroChange]);

  const toggleAberto = useCallback(() => setAberto((v) => !v), []);

  const temFiltroAtivo =
    filtro.busca.trim() !== '' ||
    Object.values(filtro.dificuldade).some(Boolean) ||
    Object.values(filtro.status).some(Boolean);

  return {
    filtro,
    aberto,
    temFiltroAtivo,
    handleBusca,
    handleCheckbox,
    handleLimpar,
    toggleAberto,
  };
};
