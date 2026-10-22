import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarUsuario } from "../../services/usuarioService";

export const useUserProfileDrawer = (onClose) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const role = localStorage.getItem("role");
  const ehAluno = role === "Usuario";

  useEffect(() => {
    let ativo = true;
    const usuarioId = localStorage.getItem("id");

    async function carregar() {
      // só aluno tem perfil em /Usuario (moedas, ofensiva...); os demais usam os dados da sessão
      const resultado = ehAluno ? await buscarUsuario(usuarioId) : { sucesso: false };
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
  }, [ehAluno]);

  const handleEditProfileClick = () => {
    onClose();
    navigate(role === "Profissional" ? "/configuracoes-medico" : role === "Admin" ? "/configuracoes-admin" : "/perfil");
  };

  const handleNotificacao = () => {
    onClose();
    navigate("/notificacoes");
  };

  return {
    ehAluno,
    usuario,
    carregando,
    handleEditProfileClick,
    handleNotificacao,
  };
};
