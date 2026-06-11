import { useState } from 'react';

export const useHeaderActions = () => {
  const [xp, setXp] = useState(1250);
  const [hasNotification, setHasNotification] = useState(true);

  const handleNotificationClick = () => {
    setHasNotification(false); 
  };

  return {
    xp,
    hasNotification,
    handleNotificationClick,
  };
};