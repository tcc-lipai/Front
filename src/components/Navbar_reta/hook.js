import { useCallback } from 'react';

export const useNavbar = (onBackClick) => {
  const handleBack = useCallback(() => {
    // O "typeof === 'function'" garante que só vai rodar se for uma função válida
    if (onBackClick && typeof onBackClick === 'function') {
      onBackClick();
    } else {
      window.history.back();
    }
  }, [onBackClick]);

  return {
    handleBack,
  };
};