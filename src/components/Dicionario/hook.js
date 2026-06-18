import { useState } from 'react';

export const useDicionarioCard = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive((prev) => !prev);
  };

  return {
    isActive,
    toggleActive,
  };
};