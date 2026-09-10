import { useNavigate } from "react-router-dom";
import Botao from "../../../components/Botao";
import PainelListaUsuarios from "../../../components/PainelListaUsuarios";
import { NAV_ITENS_ADMIN } from "../../../components/Navbar";

const PACIENTES = [
  { id: 1, nome: "Paciente 1", descricao: "lorem...", nivel: "Iniciante", status: "ativo" },
  { id: 2, nome: "Paciente 2", descricao: "lorem...", nivel: "Intermediário", status: "inativo" },
  { id: 3, nome: "Paciente 3", descricao: "lorem...", nivel: "Iniciante", status: "ativo" },
  { id: 4, nome: "Paciente 4", descricao: "lorem...", nivel: "Avançado", status: "inativo" },
];

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <PainelListaUsuarios
      titulo="Pacientes"
      itensNav={NAV_ITENS_ADMIN}
      usuarios={PACIENTES}
      tipoCard="paciente-admin"
      aoEditar={(usuario) => alert(`Editar ${usuario.nome}`)}
      aoExcluir={(usuario) => alert(`Excluir ${usuario.nome}`)}
      rodape={<Botao texto="Cadastrar" onClick={() => navigate("/cadastrar-paciente")} />}
    />
  );
};

export default DashboardAdmin;
