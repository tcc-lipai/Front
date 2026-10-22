import { useNavigate } from "react-router-dom";
import PainelListaUsuarios from "../../../components/PainelListaUsuarios";
import { NAV_ITENS_PROFISSIONAL } from "../../../components/Navbar";
import { useTelaDashboardMedico } from "./index.hook";

const DashboardMedico = () => {
  const navigate = useNavigate();
  const { pacientes, carregando, erro } = useTelaDashboardMedico();

  return (
    <PainelListaUsuarios
      titulo="Seus Pacientes"
      itensNav={NAV_ITENS_PROFISSIONAL}
      usuarios={pacientes}
      tipoCard="paciente-profissional"
      mostrarHeaderActions
      carregando={carregando}
      erro={erro}
      aoVer={(usuario) => navigate(`/paciente/${usuario.id}`)}
    />
  );
};

export default DashboardMedico;
