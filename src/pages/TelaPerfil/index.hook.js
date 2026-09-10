import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return { handleLogout };
};

export default useLogout;
