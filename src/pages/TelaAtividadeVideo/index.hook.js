import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLicaoConcluida } from "../../components/LicaoConcluida/index.hook";
import { buscarLicaoVideo } from "../../services/licaoService";
import { concluirVideo } from "../../services/progressoService";
import { formatarDuracao } from "../../utils/tempo";

const ROTA_SAIDA = "/atividades-unidades";

export function useTelaAtividadeVideo() {
  const { id: licaoId } = useParams();
  const navigate = useNavigate();
  const licaoConcluida = useLicaoConcluida();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [licao, setLicao] = useState(null);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const inicioRef = useRef(Date.now());

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

  const sair = () => navigate(ROTA_SAIDA);

  const handleFinalizar = async () => {
    if (licaoId) await concluirVideo(licaoId);
    const segundos = (Date.now() - inicioRef.current) / 1000;
    licaoConcluida.openLicaoConcluida({
      percentage: 100,
      stars: 0,
      time: formatarDuracao(segundos),
    });
  };

  const handleConfirmarSaida = () => navigate(ROTA_SAIDA);

  const handleProgressoVideo = (evento) => {
    const video = evento.target;
    if (!video.duration) return;
    setProgresso(Math.min(100, Math.round((video.currentTime / video.duration) * 100)));
  };

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
    progresso,
    handleProgressoVideo,
    licaoConcluida: {
      isOpen: licaoConcluida.isOpen,
      stats: licaoConcluida.lessonStats,
      onClose: licaoConcluida.closeLicaoConcluida,
      onExit: sair,
    },
  };
}
