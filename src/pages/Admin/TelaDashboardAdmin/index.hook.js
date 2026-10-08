import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarUsuarios, excluirUsuario, nomeNivelDificuldade } from "../../../services/usuarioService";

const DIAS_PARA_CONSIDERAR_INATIVO = 7;

function mapearPaciente(usuario) {
  const ultimaAtividade = usuario.ultimaAtividadeData ?? usuario.UltimaAtividadeData;
  const diasDesdeUltimaAtividade = ultimaAtividade
    ? (Date.now() - new Date(ultimaAtividade).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;

  return {
    id: usuario.idUsuario ?? usuario.IdUsuario,
    nome: usuario.nome ?? usuario.Nome,
    descricao: (usuario.diagnostico ?? usuario.Diagnostico) || (usuario.email ?? usuario.Email),
    nivel: nomeNivelDificuldade(usuario.nivelDificuldade ?? usuario.NivelDificuldade),
    status: diasDesdeUltimaAtividade <= DIAS_PARA_CONSIDERAR_INATIVO ? "ativo" : "inativo",
  };
}

export function useTelaDashboardAdmin() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    const res = await listarUsuarios();
    if (!res.sucesso) {
      setErro(res.mensagem);
      setCarregando(false);
      return;
    }
    setPacientes(res.data.map(mapearPaciente));
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const abrirCadastro = useCallback(() => navigate("/cadastrar-paciente"), [navigate]);
  const abrirEdicao = useCallback((paciente) => navigate(`/editar-paciente/${paciente.id}`), [navigate]);
  const pedirExclusao = useCallback((paciente) => setPacienteParaExcluir(paciente), []);
  const cancelarExclusao = useCallback(() => setPacienteParaExcluir(null), []);

  const confirmarExclusao = useCallback(async () => {
    if (!pacienteParaExcluir) return;
    setExcluindo(true);
    const res = await excluirUsuario(pacienteParaExcluir.id);
    setExcluindo(false);
    if (!res.sucesso) {
      setErro(res.mensagem);
      setPacienteParaExcluir(null);
      return;
    }
    setPacientes((atual) => atual.filter((p) => p.id !== pacienteParaExcluir.id));
    setPacienteParaExcluir(null);
  }, [pacienteParaExcluir]);

  return {
    pacientes,
    carregando,
    erro,
    pacienteParaExcluir,
    excluindo,
    abrirCadastro,
    abrirEdicao,
    pedirExclusao,
    cancelarExclusao,
    confirmarExclusao,
  };
}
