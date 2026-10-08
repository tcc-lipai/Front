import Botao from "../../../components/Botao";
import PainelListaUsuarios from "../../../components/PainelListaUsuarios";
import ModalDeletarItem from "../../../components/ModalDeletarItem";
import { NAV_ITENS_ADMIN } from "../../../components/Navbar";
import { useTelaDashboardAdmin } from "./index.hook";

const DashboardAdmin = () => {
  const {
    pacientes,
    carregando,
    erro,
    pacienteParaExcluir,
    abrirCadastro,
    abrirEdicao,
    pedirExclusao,
    cancelarExclusao,
    confirmarExclusao,
  } = useTelaDashboardAdmin();

  return (
    <>
      <PainelListaUsuarios
        titulo="Pacientes"
        itensNav={NAV_ITENS_ADMIN}
        usuarios={pacientes}
        tipoCard="paciente-admin"
        carregando={carregando}
        erro={erro}
        aoEditar={abrirEdicao}
        aoExcluir={pedirExclusao}
        rodape={<Botao texto="Cadastrar" onClick={abrirCadastro} />}
      />

      <ModalDeletarItem
        isOpen={!!pacienteParaExcluir}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />
    </>
  );
};

export default DashboardAdmin;
