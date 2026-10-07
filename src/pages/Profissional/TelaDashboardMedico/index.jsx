import PainelListaUsuarios from "../../../components/PainelListaUsuarios";
import { NAV_ITENS_PROFISSIONAL } from "../../../components/Navbar";
import { useTelaDashboardMedico } from "./index.hook";

const DashboardMedico = () => {
  const { pacientes, carregando, erro } = useTelaDashboardMedico();

  return (
    <PainelListaUsuarios
      titulo="Pacientes"
      itensNav={NAV_ITENS_PROFISSIONAL}
      usuarios={pacientes}
      tipoCard="paciente-profissional"
      mostrarHeaderActions
      carregando={carregando}
      erro={erro}
      aoVer={(usuario) => alert(`Ver ${usuario.nome}`)}
    />
  );
};

export default DashboardMedico;
