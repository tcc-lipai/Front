import { useNavigate } from "react-router-dom";

export const useUserProfileDrawer = (onClose) => {
  const navigate = useNavigate();

  const handleEditProfileClick = () => {
    onClose();
    navigate("/perfil");
  };

  const handleNotificacao = () => {
    onClose();
    navigate("/notificacoes");
  };

  return {
    handleEditProfileClick,
    handleNotificacao,
  };
};
