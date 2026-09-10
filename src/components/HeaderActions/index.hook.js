import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useHeaderActions = () => {
  const [xp] = useState(1250);
  const [hasNotification, setHasNotification] = useState(true);

  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setHasNotification(false);
    navigate("/notificacoes");
  };

  return {
    xp,
    hasNotification,
    handleNotificationClick,
  };
};
