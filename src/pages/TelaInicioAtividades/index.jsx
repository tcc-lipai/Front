import React from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import "./index.css";

import Navbar from "../../components/Navbar";
import Filtro from "../../components/Filtro";
import Botao from "../../components/Botao";
import { HeaderActions } from "../../components/HeaderActions";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";

import realizadas from "../../assets/img/realizadas.png";
import salvas from "../../assets/img/salvas.png";

import { useTelaInicioAtividades } from "./index.hook";

import backgroundOnda from "../../assets/img/background_onda.png";

const CardUnidade = ({ unidade, numero, subtitulo, onAbrir, onToggleSalvar }) => (
  <div className="card-unidade">
    <button type="button" className="card-unidade-conteudo" onClick={onAbrir}>
      {numero != null && <span className="card-unidade-numero">{numero}</span>}
      <div className="card-unidade-texto">
        <h3>{unidade.nome}</h3>
        <span>{subtitulo}</span>
      </div>
    </button>

    <button
      type="button"
      className={`card-unidade-bookmark ${unidade.salva ? "ativo" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggleSalvar(!unidade.salva);
      }}
      aria-label={unidade.salva ? "Remover unidade dos salvos" : "Salvar unidade"}
    >
      <Bookmark size={18} fill={unidade.salva ? "currentColor" : "none"} />
    </button>
  </div>
);

const ListaUnidadesModal = ({ titulo, unidades, vazio, onFechar, onIrParaUnidade, onToggleSalvar }) => (
  <div className="modal-overlay" onClick={onFechar}>
    <div className="modal-unidades-container" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-x" onClick={onFechar} aria-label="Fechar modal">
        &times;
      </button>

      <h2 className="modal-title">{titulo}</h2>

      {unidades.length === 0 ? (
        <p className="modal-subtitle">{vazio}</p>
      ) : (
        <div className="modal-lista-unidades">
          {unidades.map((unidade) => (
            <CardUnidade
              key={unidade.id}
              unidade={unidade}
              subtitulo={`${unidade.progresso}% concluído`}
              onAbrir={onIrParaUnidade}
              onToggleSalvar={(novoEstado) => onToggleSalvar(unidade.id, novoEstado)}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

const TelaInicioAtividades = () => {
  const {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    busca,
    setBusca,
    unidadesDisponiveis,
    carregando,
    qtdRealizadas,
    qtdSalvas,
    unidadesRealizadas,
    unidadesSalvas,
    modalAberto,
    abrirModalRealizadas,
    abrirModalSalvas,
    fecharModal,
    toggleSalvarUnidade,
  } = useTelaInicioAtividades();

  const navigate = useNavigate();

  const irParaUnidades = () => navigate("/atividades-unidades");

  return (
    <div className="pagina-atividades" style={{ backgroundImage: `url(${backgroundOnda})` }}>
      <Navbar />

      <div className="conteudo">
        <section className="principal">
          <div className="topo-acoes">
            <div className="menu-espaco-placeholder"></div>
            <HeaderActions onOpenProfile={abrirPerfil} />
          </div>

          <div className="banner">
            <div className="banner-texto">
              <h1>Dicionário</h1>
              <p>
                O dicionário da plataforma é uma ferramenta de apoio à leitura labial. Nele, você
                poderá pesquisar ou encontrar o nome de diferentes objetos e acessar um vídeo
                demonstrativo mostrando como realizar a leitura labial daquela palavra. Dessa forma,
                o recurso facilita o aprendizado e a prática da leitura labial de maneira visual e
                interativa.
              </p>
              <Botao
                texto="Testar"
                corDeFundo="#FFFFFF"
                corTexto="#6D458C"
                onClick={() => navigate("/dicionario")}
              />
            </div>
          </div>

          <span className="painel-progresso-titulo">Seu progresso</span>
          <div className="infos">
            <button type="button" className="card-progresso" onClick={abrirModalRealizadas}>
              <img src={realizadas} alt="" />
              <div>
                <span>{qtdRealizadas} {qtdRealizadas === 1 ? "Unidade" : "Unidades"}</span>
                <h3>Realizadas</h3>
              </div>
            </button>

            <button type="button" className="card-progresso" onClick={abrirModalSalvas}>
              <img src={salvas} alt="" />
              <div>
                <span>{qtdSalvas} {qtdSalvas === 1 ? "Unidade" : "Unidades"}</span>
                <h3>Salvas</h3>
              </div>
            </button>
          </div>

          <h2>Unidades disponíveis</h2>
          {carregando && <p className="secao-carregando">Carregando...</p>}
          {!carregando && unidadesDisponiveis.length === 0 && (
            <p>Nenhuma unidade encontrada.</p>
          )}
          {!carregando && unidadesDisponiveis.length > 0 && (
            <div className="lista-unidades">
              {unidadesDisponiveis.map((unidade, indice) => (
                <CardUnidade
                  key={unidade.id}
                  unidade={unidade}
                  numero={indice + 1}
                  subtitulo={`${unidade.totalAtividades} ${unidade.totalAtividades === 1 ? "atividade" : "atividades"}`}
                  onAbrir={irParaUnidades}
                  onToggleSalvar={(novoEstado) => toggleSalvarUnidade(unidade.id, novoEstado)}
                />
              ))}
            </div>
          )}
        </section>

        <Filtro busca={busca} setBusca={setBusca} />
      </div>

      {modalAberto === "realizadas" && (
        <ListaUnidadesModal
          titulo="Unidades realizadas"
          unidades={unidadesRealizadas}
          vazio="Você ainda não concluiu nenhuma unidade."
          onFechar={fecharModal}
          onIrParaUnidade={irParaUnidades}
          onToggleSalvar={toggleSalvarUnidade}
        />
      )}

      {modalAberto === "salvas" && (
        <ListaUnidadesModal
          titulo="Unidades salvas"
          unidades={unidadesSalvas}
          vazio="Você ainda não salvou nenhuma unidade."
          onFechar={fecharModal}
          onIrParaUnidade={irParaUnidades}
          onToggleSalvar={toggleSalvarUnidade}
        />
      )}

      <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />
    </div>
  );
};

export default TelaInicioAtividades;
