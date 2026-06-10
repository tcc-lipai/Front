import { useState, useMemo } from 'react';
import { PALAVRAS_MOCK, CATEGORIAS, LETRAS } from './index.types';

export const useDicionario = () => {
  const [busca, setBusca] = useState('');
  const [letraAtiva, setLetraAtiva] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [favoritos, setFavoritos] = useState({});
  const [expandido, setExpandido] = useState(null);

  const palavrasFiltradas = useMemo(() => {
    return PALAVRAS_MOCK.filter((p) => {
      const matchBusca = busca === '' || p.palavra.toLowerCase().includes(busca.toLowerCase());
      const matchLetra = letraAtiva === '' || p.palavra[0].toUpperCase() === letraAtiva;
      const matchCategoria = categoriaAtiva === '' || p.categoria === categoriaAtiva;
      return matchBusca && matchLetra && matchCategoria;
    });
  }, [busca, letraAtiva, categoriaAtiva]);

  const grupos = useMemo(() => {
    const agrupar = {};
    palavrasFiltradas.forEach((p) => {
      const letra = p.palavra[0].toUpperCase();
      if (!agrupar[letra]) agrupar[letra] = [];
      agrupar[letra].push(p);
    });
    return agrupar;
  }, [palavrasFiltradas]);

  const letrasComPalavra = Object.keys(grupos).sort();

  const toggleFavorito = (id) => {
    setFavoritos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpandido = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const limparFiltros = () => {
    setBusca('');
    setLetraAtiva('');
    setCategoriaAtiva('');
  };

  return {
    busca,
    setBusca,
    letraAtiva,
    setLetraAtiva,
    categoriaAtiva,
    setCategoriaAtiva,
    favoritos,
    toggleFavorito,
    expandido,
    toggleExpandido,
    limparFiltros,
    palavrasFiltradas,
    grupos,
    letrasComPalavra,
    CATEGORIAS,
    LETRAS,
  };
};
