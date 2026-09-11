import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

import Navbar from "../../components/Navbar";
import Filtro from "../../components/Filtro";
import InfoAtividade from "../../components/InfoAtividades";
import Botao from "../../components/Botao";
import { HeaderActions } from "../../components/HeaderActions";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";

import realizadas from "../../assets/img/realizadas.png";
import salvas from "../../assets/img/salvas.png";
import revisadas from "../../assets/img/revisadas.png";

import { useTelaInicioAtividades } from "./index.hook";

import backgroundOnda from "../../assets/img/background_onda.png";

const TelaInicioAtividades = () => {
  const {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    busca,
    setBusca,
    dificuldade,
    setDificuldade,
    status,
    setStatus,
    alternarItem,
    atividadesFiltradas,
    carregando,
    qtdRealizadas,
    qtdSalvas,
    qtdEmAndamento,
    atividadesSalvasIds,
    toggleSalvar,
  } = useTelaInicioAtividades();

  const navigate = useNavigate();

  const irParaLicao = (atividade) => {
    navigate(`/atividade/${atividade.tipo}/${atividade.licaoId}`);
  };

  const atividadesParaContinuar = atividadesFiltradas.filter((a) => a.categoria === "continuar");
  // Recomendadas: não iniciadas (exclui as concluídas para não poluir)
  const atividadesRecomendadas = atividadesFiltradas.filter(
    (a) => a.categoria === "recomendada" && a.progresso < 100
  );

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
            <div className="card-progresso">
              <img src={realizadas} alt="" />
              <div>
                <span>{qtdRealizadas} {qtdRealizadas === 1 ? "Atividade" : "Atividades"}</span>
                <h3>Realizadas</h3>
              </div>
            </div>

            <div className="card-progresso">
              <img src={salvas} alt="" />
              <div>
                <span>{qtdSalvas} {qtdSalvas === 1 ? "Atividade" : "Atividades"}</span>
                <h3>Salvas</h3>
              </div>
            </div>

            <div className="card-progresso">
              <img src={revisadas} alt="" />
              <div>
                <span>{qtdEmAndamento} {qtdEmAndamento === 1 ? "Atividade" : "Atividades"}</span>
                <h3>Em Andamento</h3>
              </div>
            </div>
          </div>

          <h2>Continuar Atividade</h2>
          {carregando && <p className="secao-carregando">Carregando...</p>}
          {!carregando && atividadesParaContinuar.length === 0 && (
            <p>Nenhuma atividade em andamento. Comece uma abaixo!</p>
          )}
          {atividadesParaContinuar.map((atividade) => (
            <InfoAtividade
              key={atividade.id}
              titulo={atividade.titulo}
              descricao={atividade.descricao}
              dificuldade={atividade.dificuldade}
              tipo={atividade.tipo}
              progresso={atividade.progresso}
              salva={atividadesSalvasIds.has(atividade.atividadeId ?? atividade.licaoId)}
              onAvancar={() => irParaLicao(atividade)}
              onToggleSalvar={(novoEstado) => toggleSalvar(atividade, novoEstado)}
            />
          ))}

          <h2>Recomendadas</h2>
          {carregando && <p className="secao-carregando">Carregando...</p>}
          {!carregando && atividadesRecomendadas.length === 0 && (
            <p>Nenhuma atividade disponível neste filtro.</p>
          )}
          {atividadesRecomendadas.map((atividade) => (
            <InfoAtividade
              key={atividade.id}
              titulo={atividade.titulo}
              descricao={atividade.descricao}
              dificuldade={atividade.dificuldade}
              tipo={atividade.tipo}
              progresso={atividade.progresso}
              salva={atividadesSalvasIds.has(atividade.atividadeId ?? atividade.licaoId)}
              onAvancar={() => irParaLicao(atividade)}
              onToggleSalvar={(novoEstado) => toggleSalvar(atividade, novoEstado)}
            />
          ))}
        </section>

        <Filtro
          busca={busca}
          setBusca={setBusca}
          dificuldade={dificuldade}
          setDificuldade={setDificuldade}
          status={status}
          setStatus={setStatus}
          alternarItem={alternarItem}
        />
      </div>

      <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />
    </div>
  );
};

export default TelaInicioAtividades;
