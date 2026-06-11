import { useNavigate } from 'react-router-dom';

export const useUserProfileDrawer = (onClose) => {
  const navigate = useNavigate();

  const handleEditProfileClick = () => {
    onClose(); // Fecha a barra lateral
    navigate('/perfil'); // Navega para a tela de perfil
  };

  return {
    handleEditProfileClick,
  };
};