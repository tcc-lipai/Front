import "./index.css";

import Navbar from "../../components/Navbar";
import Filtro from "../../components/Filtro";
import InfoAtividade from "../../components/InfoAtividades/InfoAtividades";
import Botao from "../../components/Botao";
import { HeaderActions } from "../../components/infoEstrelas";

import personagem from "../../assets/img/bia_inicioatividade.png";

import realizadas from "../../assets/img/realizadas.png";
import salvas from "../../assets/img/salvas.png";
import revisadas from "../../assets/img/revisadas.png";

const TelaInicioAtividades = () => {
  return (
    <div className="pagina-atividades">

      <Navbar />

      <div className="conteudo">

        <section className="principal">

          <div className="topo-acoes">
            <HeaderActions />
          </div>

          <div className="banner">

            <div className="banner-texto">

              <h1>Dicionário</h1>

              <p>
                Teste seus conhecimentos de leitura labial através de um
                dicionário. Veja quais são cha cha vdw chawd w w daw
                dwdad wd a dw ad wad wad wd
              </p>

              <Botao
                texto="Testar"
                corDeFundo="#FFFFFF"
                corTexto="#6D458C"
              />

            </div>

            <img
              src={personagem}
              alt=""
            />

          </div>

          <div className="infos">

            <div className="card-info">
              <img src={realizadas} alt="" />

              <div>
                <span>10 Atividades</span>
                <h3>Realizadas</h3>
              </div>
            </div>

            <div className="card-info">
              <img src={salvas} alt="" />

              <div>
                <span>08 Atividades</span>
                <h3>Salvas</h3>
              </div>
            </div>

            <div className="card-info">
              <img src={revisadas} alt="" />

              <div>
                <span>02 Atividades</span>
                <h3>Revisadas</h3>
              </div>
            </div>

          </div>

          <h2>Continuar Atividade</h2>

          <InfoAtividade
            titulo="Primeira Atividade"
            descricao="Teste seus conhecimentos de leitura labial através de uma ferramenta de IA. Responda as perguntas e melhore suas habilidades de leitura labial!"
            dificuldade="Iniciante"
            tipo="Escrita"
            progresso={65}
          />

          <h2>Recomendadas</h2>

          <InfoAtividade
            titulo="Primeira Atividade"
            descricao="Teste seus conhecimentos de leitura labial através de uma ferramenta de IA. Responda as perguntas e melhore suas habilidades de leitura labial!"
            dificuldade="Iniciante"
            tipo="Escrita"
          />

          <InfoAtividade
            titulo="Primeira Atividade"
            descricao="Teste seus conhecimentos de leitura labial através de uma ferramenta de IA. Responda as perguntas e melhore suas habilidades de leitura labial!"
            dificuldade="Iniciante"
            tipo="Escrita"
          />

        </section>

        <Filtro />

      </div>

    </div>
  );
};

export default TelaInicioAtividades;