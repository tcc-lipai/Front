import { useState } from 'react';
import { DEFAULT_CONQUISTA_DATA } from './types';

export const useConquistas = () => {
  const [conquistaData, setConquistaData] = useState(DEFAULT_CONQUISTA_DATA);

  const atualizarConquista = (novoTitulo, novoSubtitulo) => {
    setConquistaData({
      title: novoTitulo || DEFAULT_CONQUISTA_DATA.title,
      subtitle: novoSubtitulo || DEFAULT_CONQUISTA_DATA.subtitle
    });
  };

  return {
    conquistaData,
    atualizarConquista
  };
};