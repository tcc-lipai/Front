import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLicaoConcluida } from "../../components/LicaoConcluida/index.hook";
import { buscarLicaoVibracao } from "../../services/licaoService";
import { concluirVibracao } from "../../services/progressoService";
import { formatarDuracao } from "../../utils/tempo";

const ROTA_SAIDA = "/atividades-unidades";

export function useTelaAcompanhanteIA() {
  const { id: licaoId } = useParams();
  const navigate = useNavigate();
  const licaoConcluida = useLicaoConcluida();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [licao, setLicao] = useState(null);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  const inicioRef = useRef(Date.now());

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const res = await buscarLicaoVibracao(licaoId);
      if (!ativo) return;
      if (!res.sucesso) {
        setErro(res.mensagem);
      } else {
        setLicao(res.data);
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
    if (licaoId) await concluirVibracao(licaoId);
    const segundos = (Date.now() - inicioRef.current) / 1000;
    licaoConcluida.openLicaoConcluida({
      percentage: 100,
      stars: 0,
      time: formatarDuracao(segundos),
    });
  };

  return {
    carregando,
    erro,
    silaba: licao?.silaba ?? licao?.Silaba ?? "",
    instrucao: licao?.instrucao ?? licao?.Instrucao ?? "",
    mostrarModalSair,
    setMostrarModalSair,
    handleFinalizar,
    sair,
    licaoConcluida: {
      isOpen: licaoConcluida.isOpen,
      stats: licaoConcluida.lessonStats,
      onClose: licaoConcluida.closeLicaoConcluida,
      onExit: sair,
    },
  };
}
