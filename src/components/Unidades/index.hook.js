import { useState } from 'react';
import { UNIDADE_MODELO } from './index.types';

export const useUnidades = () => {
  const [unidade] = useState(UNIDADE_MODELO);

  return {
    unidade,
  };
};
