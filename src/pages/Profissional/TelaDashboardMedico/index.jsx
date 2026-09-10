import PainelListaUsuarios from "../../../components/PainelListaUsuarios";
import { NAV_ITENS_PROFISSIONAL } from "../../../components/Navbar";

const PACIENTES = [
  { id: 1, nome: "Paciente 1", descricao: "lorem...", nivel: "Iniciante", status: "ativo" },
  { id: 2, nome: "Paciente 2", descricao: "lorem...", nivel: "Intermediário", status: "inativo" },
  { id: 3, nome: "Paciente 3", descricao: "lorem...", nivel: "Iniciante", status: "inativo" },
  { id: 4, nome: "Paciente 4", descricao: "lorem...", nivel: "Avançado", status: "inativo" },
];

const DashboardMedico = () => (
  <PainelListaUsuarios
    titulo="Pacientes"
    itensNav={NAV_ITENS_PROFISSIONAL}
    usuarios={PACIENTES}
    tipoCard="paciente-profissional"
    mostrarHeaderActions
    aoVer={(usuario) => alert(`Ver ${usuario.nome}`)}
  />
);

export default DashboardMedico;
