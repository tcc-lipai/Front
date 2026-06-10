import { useState } from 'react';

export const useHeaderActions = () => {
  const [xp, setXp] = useState(1250); // Exemplo de pontuação/estrela
  const [hasNotification, setHasNotification] = useState(true);

  const handleProfileClick = () => {
    console.log('Abrir menu do perfil');
  };

  const handleNotificationClick = () => {
    console.log('Abrir notificações');
    setHasNotification(false); // Limpa a notificação ao clicar
  };

  return {
    xp,
    hasNotification,
    handleProfileClick,
    handleNotificationClick,
  };
};