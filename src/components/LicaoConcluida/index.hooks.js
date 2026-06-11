import { useState } from 'react';
import { INITIAL_LESSON_STATS } from './types';

export const useLicaoConcluida = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(INITIAL_LESSON_STATS);

  const openLicaoConcluida = (lessonStats) => {
    if (lessonStats) {
      setStats({
        percentage: lessonStats.percentage ?? 0,
        stars: lessonStats.stars ?? 0,
        time: lessonStats.time ?? '00:00'
      });
    }
    setIsOpen(true);
  };

  const closeLicaoConcluida = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    lessonStats: stats,
    openLicaoConcluida,
    closeLicaoConcluida
  };
};