import Botao from "../../../components/Botao";
import PainelListaUsuarios from "../../../components/PainelListaUsuarios";
import ModalDeletarItem from "../../../components/ModalDeletarItem";
import { NAV_ITENS_ADMIN } from "../../../components/Navbar";
import { useTelaProfissionaisAdmin } from "./index.hook";

const ProfissionaisAdmin = () => {
  const {
    profissionais,
    carregando,
    erro,
    vinculados,
    carregandoVinculados,
    fecharVinculados,
    verPacientes,
    profissionalParaExcluir,
    setProfissionalParaExcluir,
    cancelarExclusao,
    confirmarExclusao,
    abrirCadastro,
    abrirEdicao,
  } = useTelaProfissionaisAdmin();

  return (
    <>
      <PainelListaUsuarios
        titulo="Profissionais"
        itensNav={NAV_ITENS_ADMIN}
        usuarios={profissionais}
        tipoCard="profissional"
        carregando={carregando}
        erro={erro}
        aoVer={verPacientes}
        aoEditar={abrirEdicao}
        aoExcluir={setProfissionalParaExcluir}
        rodape={<Botao texto="Cadastrar" onClick={abrirCadastro} />}
      />

      <ModalDeletarItem
        isOpen={!!profissionalParaExcluir}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />

      {vinculados && (
        <div className="modal-overlay" onClick={fecharVinculados}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={fecharVinculados} aria-label="Fechar">
              &times;
            </button>
            <h2 className="modal-title">Pacientes de {vinculados.nome}</h2>

            {carregandoVinculados && <p>Carregando...</p>}
            {vinculados.erro && <p>{vinculados.erro}</p>}
            {!carregandoVinculados && !vinculados.erro && vinculados.pacientes.length === 0 && (
              <p>Nenhum paciente vinculado.</p>
            )}

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", textAlign: "left" }}>
              {vinculados.pacientes.map((p) => (
                <li key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--lipai-border)" }}>
                  <strong>{p.nome}</strong>
                  <div style={{ fontSize: "0.85rem" }}>
                    {p.email} · {p.nivel || "sem nível"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfissionaisAdmin;
