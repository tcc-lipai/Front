import { DicionarioCard } from "../../components/Dicionario";
import Navbar from "../../components/Navbar";
import { HeaderActions } from "../../components/HeaderActions";
import Botao from "../../components/Botao";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";
import { ModalVideoDicionario } from "../../components/ModalVideoDicionario";
import "./index.css";

import { useTelaDicionario } from "./index.hook";

import backgroundOnda from "../../assets/img/background_onda.png";

const TelaDicionario = () => {
  const {
    carregando,
    erro,
    categorias,
    categoriaAtiva,
    setCategoriaAtiva,
    cardsFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    palavraAberta,
    abrirPalavra,
    fecharPalavra,
  } = useTelaDicionario();

  return (
    <div className="tela-dicionario" style={{ backgroundImage: `url(${backgroundOnda})` }}>
      <Navbar />

      <main className="tela-dicionario__conteudo">
        <div className="tela-dicionario__topo">
          <HeaderActions onOpenProfile={abrirPerfil} />
        </div>

        <section className="tela-dicionario__painel">
          <h1 className="tela-dicionario__titulo">Dicionário</h1>
          <p className="tela-dicionario__descricao">
            Aprenda a leitura labial de diferentes palavras com vídeos demonstrativos.
          </p>

          {carregando && <p className="carregando-atrasado tela-dicionario__vazio">Carregando...</p>}
          {!carregando && erro && <p className="tela-dicionario__vazio">{erro}</p>}

          {!carregando && !erro && (
            <>
              <div className="tela-dicionario__filtros">
                {categorias.map((categoria) => {
                  const id = categoria.idCategoria ?? categoria.IdCategoria;
                  const nome = categoria.nome ?? categoria.Nome;
                  const isActive = categoriaAtiva === id;
                  return (
                    <Botao
                      key={id}
                      texto={nome}
                      onClick={() => setCategoriaAtiva(id)}
                      variante={isActive ? "primario" : "secundario"}
                      className="btn-filter"
                    />
                  );
                })}
              </div>

              <div className="tela-dicionario__grid">
                {cardsFiltrados.map((palavra) => {
                  const id = palavra.idPalavra ?? palavra.IdPalavra;
                  return (
                    <div className="tela-dicionario__grid-item" key={id}>
                      <DicionarioCard
                        titulo={palavra.nome ?? palavra.Nome}
                        descricao={palavra.nomeCategoria ?? palavra.NomeCategoria ?? ""}
                        imagemUrl={palavra.imagemUrl ?? palavra.ImagemUrl ?? ""}
                        onAbrir={() => abrirPalavra(palavra)}
                      />
                    </div>
                  );
                })}

                {cardsFiltrados.length === 0 && (
                  <p className="tela-dicionario__vazio">Nenhuma palavra nesta categoria ainda.</p>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />

      <ModalVideoDicionario
        isOpen={!!palavraAberta}
        onClose={fecharPalavra}
        titulo={palavraAberta?.nome ?? palavraAberta?.Nome ?? ""}
        videoUrl={palavraAberta?.videoUrl ?? palavraAberta?.VideoUrl ?? ""}
      />
    </div>
  );
};

export default TelaDicionario;
