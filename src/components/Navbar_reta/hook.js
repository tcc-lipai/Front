import { useCallback } from 'react';

export const useNavbar = (onBackClick) => {
  const handleBack = useCallback(() => {
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