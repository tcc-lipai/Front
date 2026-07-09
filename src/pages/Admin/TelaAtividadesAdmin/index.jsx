import React from "react";
import { Search, ChevronDown } from "lucide-react";
// Ajuste os caminhos abaixo conforme a localização real dos componentes
// no seu projeto (baseado na estrutura de pastas que você mostrou).
import Navbar from "../../../components/Navbar";
import InfoAtividade from "../../../components/InfoAtividades/InfoAtividades";
import { useTelaAtividadesAdmin } from "./index.hook";
import "./index.css";

const TelaAtividadesAdmin = () => {
  const {
    termoBusca,
    atividadesVisiveis,
    podeVerMais,
    handleBuscar,
    handleVerMais,
    handleEditar,
    handleExcluir,
  } = useTelaAtividadesAdmin();

  return (
    <div className="tela-atividades-admin">
      <Navbar />

      <main className="atividades-admin__conteudo">
        <h1 className="atividades-admin__titulo">Atividade</h1>

        <section className="atividades-admin__painel">
          <div className="atividades-admin__busca">
            <input
              type="text"
              placeholder="Pesquise"
              value={termoBusca}
              onChange={handleBuscar}
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
              <p className="atividades-admin__vazio">
                Nenhuma atividade encontrada.
              </p>
            )}
          </div>

          {podeVerMais && (
            <button
              type="button"
              className="atividades-admin__ver-mais"
              onClick={handleVerMais}
            >
              Ver mais
              <ChevronDown size={16} />
            </button>
          )}
        </section>
      </main>
    </div>
  );
};

export default TelaAtividadesAdmin;