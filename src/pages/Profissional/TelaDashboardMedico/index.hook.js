import { useEffect, useState } from "react";
import { listarPacientesDoProfissional } from "../../../services/profissionalService";
import { nomeNivelDificuldade } from "../../../services/usuarioService";

const DIAS_PARA_CONSIDERAR_INATIVO = 7;

function mapearPaciente(paciente) {
  const ultimaAtividade = paciente.ultimaAtividadeData ?? paciente.UltimaAtividadeData;
  const dias = ultimaAtividade
    ? (Date.now() - new Date(ultimaAtividade).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;

  return {
    id: paciente.idUsuario ?? paciente.IdUsuario,
    nome: paciente.nome ?? paciente.Nome,
    descricao: (paciente.diagnostico ?? paciente.Diagnostico) || (paciente.email ?? paciente.Email),
    nivel: nomeNivelDificuldade(paciente.nivelDificuldade ?? paciente.NivelDificuldade),
    status: dias <= DIAS_PARA_CONSIDERAR_INATIVO ? "ativo" : "inativo",
  };
}

export function useTelaDashboardMedico() {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const res = await listarPacientesDoProfissional();
      if (!ativo) return;
      if (!res.sucesso) {
        setErro(res.mensagem);
      } else {
        setPacientes(res.data.map(mapearPaciente));
      }
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return { pacientes, carregando, erro };
}
