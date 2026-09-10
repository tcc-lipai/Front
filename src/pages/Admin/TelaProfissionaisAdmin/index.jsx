import { useNavigate } from "react-router-dom";
import Botao from "../../../components/Botao";
import PainelListaUsuarios from "../../../components/PainelListaUsuarios";
import { NAV_ITENS_ADMIN } from "../../../components/Navbar";

const PROFISSIONAIS = [
  { id: 1, nome: "Profissional 1", descricao: "lorem...", nivel: "Iniciante", status: "ativo" },
  {
    id: 2,
    nome: "Profissional 2",
    descricao: "lorem...",
    nivel: "Intermediário",
    status: "inativo",
  },
  { id: 3, nome: "Profissional 3", descricao: "lorem...", nivel: "Iniciante", status: "ativo" },
  { id: 4, nome: "Profissional 4", descricao: "lorem...", nivel: "Avançado", status: "inativo" },
];

const ProfissionaisAdmin = () => {
  const navigate = useNavigate();

  return (
    <PainelListaUsuarios
      titulo="Profissionais"
      itensNav={NAV_ITENS_ADMIN}
      usuarios={PROFISSIONAIS}
      tipoCard="paciente-admin"
      aoEditar={(usuario) => alert(`Editar ${usuario.nome}`)}
      aoExcluir={(usuario) => alert(`Excluir ${usuario.nome}`)}
      rodape={<Botao texto="Cadastrar" onClick={() => navigate("/cadastrar-paciente")} />}
    />
  );
};

export default ProfissionaisAdmin;
