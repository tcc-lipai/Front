import { useState, useCallback } from 'react';

export const useFiltro = () => {
  const [busca, setBusca] = useState('');
  const [dificuldades, setDificuldades] = useState({
    iniciante: false,
    intermediario: false,
    avancado: false,
  });
  const [status, setStatus] = useState({
    bloqueado: false,
    disponivel: false,
    emAndamento: false,
    concluido: false,
  });

  const toggleDificuldade = useCallback((dificuldade) => {
    setDificuldades((prev) => ({
      ...prev,
      [dificuldade]: !prev[dificuldade],
    }));
  }, []);

  const toggleStatus = useCallback((st) => {
    setStatus((prev) => ({
      ...prev,
      [st]: !prev[st],
    }));
  }, []);

  const limparFiltros = useCallback(() => {
    setBusca('');
    setDificuldades({
      iniciante: false,
      intermediario: false,
      avancado: false,
    });
    setStatus({
      bloqueado: false,
      disponivel: false,
      emAndamento: false,
      concluido: false,
    });
  }, []);

  const temFiltroAtivo = useCallback(() => {
    return (
      busca !== '' ||
      Object.values(dificuldades).some((v) => v) ||
      Object.values(status).some((v) => v)
    );
  }, [busca, dificuldades, status]);

  return {
    busca,
    setBusca,
    dificuldades,
    toggleDificuldade,
    status,
    toggleStatus,
    limparFiltros,
    temFiltroAtivo: temFiltroAtivo(),
  };
};
