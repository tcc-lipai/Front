// src/pages/TelaDicionario/index.hook.js
import { useState, useMemo, useCallback } from 'react';

/** @type {import('./index.types').PalavraItem[]} */
const PALAVRAS_MOCK = [
  { id: 1,  palavra: 'Água',       descricao: 'Líquido essencial para a vida.',                       categoria: 'substantivo', dica: 'Lábios formam um "A" arredondado seguido de "gua".',   favorito: false },
  { id: 2,  palavra: 'Amor',       descricao: 'Sentimento de afeto profundo por alguém.',             categoria: 'substantivo', dica: 'Lábios abrem no "A" e fecham suavemente no "r".',      favorito: true  },
  { id: 3,  palavra: 'Bom dia',    descricao: 'Saudação usada pela manhã.',                           categoria: 'cumprimento', dica: '"B" fecha os lábios; "dia" abre com "d" dental.',       favorito: false },
  { id: 4,  palavra: 'Boa tarde',  descricao: 'Saudação usada à tarde.',                              categoria: 'cumprimento', dica: '"Tarde" tem o "t" dental e o "r" vibrante.',            favorito: false },
  { id: 5,  palavra: 'Boa noite',  descricao: 'Saudação usada à noite.',                              categoria: 'cumprimento', dica: '"Noite" tem o "n" nasal e o "oi" labial.',              favorito: false },
  { id: 6,  palavra: 'Casa',       descricao: 'Local onde se mora; habitação.',                       categoria: 'substantivo', dica: '"C" fecha o palato; "asa" abre os lábios gradualmente.', favorito: false },
  { id: 7,  palavra: 'Comer',      descricao: 'Ato de ingerir alimentos.',                            categoria: 'verbo',       dica: '"C" palatal seguido de "omer" com boca aberta.',        favorito: false },
  { id: 8,  palavra: 'Desculpa',   descricao: 'Pedido de perdão por um erro.',                        categoria: 'expressao',   dica: '"Des" dental; "culpa" fecha no "p" bilabial.',          favorito: false },
  { id: 9,  palavra: 'Escola',     descricao: 'Instituição de ensino.',                               categoria: 'substantivo', dica: '"Es" sibilante; "cola" fecha no "l" lateral.',          favorito: false },
  { id: 10, palavra: 'Família',    descricao: 'Grupo de pessoas unidas por laços afetivos ou de sangue.', categoria: 'substantivo', dica: '"F" labiodental; "amília" com "m" bilabial.',      favorito: true  },
  { id: 11, palavra: 'Feliz',      descricao: 'Estado de alegria e contentamento.',                   categoria: 'adjetivo',    dica: '"F" labiodental; "eliz" com "z" sibilante final.',      favorito: false },
  { id: 12, palavra: 'Obrigado',   descricao: 'Expressão de gratidão.',                               categoria: 'expressao',   dica: '"O" arredondado; "brigado" com "b" bilabial forte.',   favorito: false },
  { id: 13, palavra: 'Olá',        descricao: 'Saudação informal.',                                   categoria: 'cumprimento', dica: '"O" arredondado; "lá" com "l" lateral claro.',          favorito: false },
  { id: 14, palavra: 'Por favor',  descricao: 'Expressão de cortesia ao fazer um pedido.',            categoria: 'expressao',   dica: '"Por" labial; "favor" com "f" labiodental.',            favorito: false },
  { id: 15, palavra: 'Sim',        descricao: 'Afirmação positiva.',                                  categoria: 'expressao',   dica: '"S" sibilante; "im" fecha os lábios no "m".',           favorito: false },
  { id: 16, palavra: 'Não',        descricao: 'Negação.',                                             categoria: 'expressao',   dica: '"N" nasal; "ão" arredonda os lábios.',                  favorito: false },
  { id: 17, palavra: 'Trabalho',   descricao: 'Atividade realizada para produzir algo ou ganhar renda.', categoria: 'substantivo', dica: '"Tr" vibrante; "balho" com "b" bilabial.',           favorito: false },
  { id: 18, palavra: 'Urgente',    descricao: 'Que requer atenção imediata.',                         categoria: 'adjetivo',    dica: '"U" arredondado; "rgente" com "g" velar.',              favorito: false },
  { id: 19, palavra: 'Vida',       descricao: 'Existência de um ser vivo.',                           categoria: 'substantivo', dica: '"V" labiodental; "ida" abre os lábios gradualmente.',   favorito: false },
  { id: 20, palavra: 'Xícara',     descricao: 'Pequeno recipiente para bebidas quentes.',             categoria: 'substantivo', dica: '"X" palatal; "ícara" com "c" palatal suave.',           favorito: false },
];

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Hook da TelaDicionario.
 * Gerencia busca, filtro por letra, categoria e favoritos.
 */
export const useTelaDicionario = () => {
  const [busca, setBusca] = useState('');
  const [letraAtiva, setLetraAtiva] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [apenasFlavoritos, setApenasFlavoritos] = useState(false);
  const [palavras, setPalavras] = useState(PALAVRAS_MOCK);
  const [palavraSelecionada, setPalavraSelecionada] = useState(null);

  const palavrasFiltradas = useMemo(() => {
    return palavras.filter((p) => {
      const matchBusca =
        busca.trim() === '' ||
        p.palavra.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao.toLowerCase().includes(busca.toLowerCase());

      const matchLetra =
        letraAtiva === '' ||
        p.palavra.toUpperCase().startsWith(letraAtiva);

      const matchCategoria =
        categoriaAtiva === '' || p.categoria === categoriaAtiva;

      const matchFavorito = !apenasFlavoritos || p.favorito;

      return matchBusca && matchLetra && matchCategoria && matchFavorito;
    });
  }, [palavras, busca, letraAtiva, categoriaAtiva, apenasFlavoritos]);

  /** Letras que possuem ao menos uma palavra no mock */
  const letrasComPalavra = useMemo(
    () => new Set(palavras.map((p) => p.palavra[0].toUpperCase())),
    [palavras],
  );

  /** @param {string} valor */
  const handleBusca = useCallback((valor) => {
    setBusca(valor);
    setLetraAtiva('');
  }, []);

  /** @param {string} letra */
  const handleLetra = useCallback((letra) => {
    setLetraAtiva((prev) => (prev === letra ? '' : letra));
    setBusca('');
  }, []);

  /** @param {string} cat */
  const handleCategoria = useCallback((cat) => {
    setCategoriaAtiva((prev) => (prev === cat ? '' : cat));
  }, []);

  const handleToggleFavoritos = useCallback(() => {
    setApenasFlavoritos((v) => !v);
  }, []);

  /** @param {number} id */
  const handleToggleFavorito = useCallback((id) => {
    setPalavras((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorito: !p.favorito } : p)),
    );
  }, []);

  /** @param {import('./index.types').PalavraItem | null} palavra */
  const handleSelecionarPalavra = useCallback((palavra) => {
    setPalavraSelecionada((prev) => (prev?.id === palavra?.id ? null : palavra));
  }, []);

  const handleLimparFiltros = useCallback(() => {
    setBusca('');
    setLetraAtiva('');
    setCategoriaAtiva('');
    setApenasFlavoritos(false);
  }, []);

  const temFiltroAtivo =
    busca.trim() !== '' || letraAtiva !== '' || categoriaAtiva !== '' || apenasFlavoritos;

  return {
    palavrasFiltradas,
    letrasComPalavra,
    letras: LETRAS,
    busca,
    letraAtiva,
    categoriaAtiva,
    apenasFlavoritos,
    temFiltroAtivo,
    palavraSelecionada,
    handleBusca,
    handleLetra,
    handleCategoria,
    handleToggleFavoritos,
    handleToggleFavorito,
    handleSelecionarPalavra,
    handleLimparFiltros,
  };
};
