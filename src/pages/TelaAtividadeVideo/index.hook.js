import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buscarLicaoVideo } from "../../services/licaoService";

const ROTA_SAIDA = "/atividades-unidades";

export function useTelaAtividadeVideo() {
  const { id: licaoId } = useParams();
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [licao, setLicao] = useState(null);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const resultado = await buscarLicaoVideo(licaoId);
      if (!ativo) return;

      if (resultado.sucesso) {
        setLicao(resultado.data);
      } else {
        setErro(resultado.mensagem);
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [licaoId]);

  const handleFinalizar = () => navigate(ROTA_SAIDA);
  const handleConfirmarSaida = () => navigate(ROTA_SAIDA);

  return {
    carregando,
    erro,
    titulo: licao?.titulo ?? licao?.Titulo ?? "",
    descricao: licao?.videoDescricao ?? licao?.VideoDescricao ?? "",
    videoUrl: licao?.videoUrl ?? licao?.VideoUrl ?? "",
    mostrarModalSair,
    setMostrarModalSair,
    handleFinalizar,
    handleConfirmarSaida,
  };
}
