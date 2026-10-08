import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarUsuario } from "../../services/usuarioService";

export const useUserProfileDrawer = (onClose) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    const usuarioId = localStorage.getItem("id");

    async function carregar() {
      const resultado = await buscarUsuario(usuarioId);
      if (!ativo) return;

      if (resultado.sucesso) {
        setUsuario(resultado.data);
      } else {
        setUsuario({
          nome: localStorage.getItem("nome") || "",
          email: localStorage.getItem("email") || "",
        });
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const handleEditProfileClick = () => {
    onClose();
    navigate("/perfil");
  };

  const handleNotificacao = () => {
    onClose();
    navigate("/notificacoes");
  };

  return {
    usuario,
    carregando,
    handleEditProfileClick,
    handleNotificacao,
  };
};
