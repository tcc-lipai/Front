import React from "react";
import { Search, ChevronDown } from "lucide-react";
import InfoAtividade from "../../../components/InfoAtividades";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { UserProfileDrawer } from "../../../components/UserProfileDrawer";
import { useTelaAtividadesAdmin } from "./index.hook";
import "./index.css";

const TelaAtividadesAdmin = () => {
  const {
    termoBusca,
    atividadesVisiveis,
    podeVerMais,
    drawerAberto,
    fecharPerfil,
    handleBuscar,
    handleVerMais,
    handleEditar,
    handleExcluir,
  } = useTelaAtividadesAdmin();

  return (
    <div className="tela-atividades-admin">
      <NavbarAdmin />

      <main className="atividades-admin__conteudo">
        <h1 className="atividades-admin__titulo">Atividade</h1>

        <section className="atividades-admin__painel">
          <div className="atividades-admin__busca">
            <input
              type="text"
              placeholder="Pesquise"
              value={termoBusca}
              onChange={handleBuscar}
              aria-label="Pesquisar atividades"
            />
            <Search size={18} className="atividades-admin__busca-icone" />
          </div>

          <div className="atividades-admin__lista">
            {atividadesVisiveis.map((atividade) => (
              <InfoAtividade
                key={atividade.id}
                modoAdmin
                titulo={atividade.titulo}
                descricao={atividade.descricao}
                dificuldade={atividade.dificuldade}
                tipo={atividade.tipo}
                progresso={atividade.progresso}
                onEditar={() => handleEditar(atividade.id)}
                onExcluir={() => handleExcluir(atividade.id)}
              />
            ))}

            {atividadesVisiveis.length === 0 && (
              <p className="atividades-admin__vazio">Nenhuma atividade encontrada.</p>
            )}
          </div>

          {podeVerMais && (
            <button type="button" className="atividades-admin__ver-mais" onClick={handleVerMais}>
              Ver mais
              <ChevronDown size={16} />
            </button>
          )}
        </section>
      </main>

      <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />
    </div>
  );
};

export default TelaAtividadesAdmin;
