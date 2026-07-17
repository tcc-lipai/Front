import { useNavigate } from 'react-router-dom';

export const useUserProfileDrawer = (onClose) => {
  const navigate = useNavigate();

  const handleEditProfileClick = () => {
    onClose(); 
    navigate('/perfil'); 
  };

  return {
    handleEditProfileClick,
  };
};