import { useNavigate } from "react-router-dom";
import CardExercicio from "../../components/CardExercicio";
import Navbar from "../../components/NavbarVoltar";
import { useTelaInicioAtividadeUnidade } from "./index.hook";

import video from "../../assets/img/video.png";
import atividade from "../../assets/img/atividade.png";
import labios from "../../assets/img/labios.png";

import "./index.css";

const TelaInicioAtividadeUnidade = () => {
  const navigate = useNavigate();
  const { carregando, erro, unidades } = useTelaInicioAtividadeUnidade();

  return (
    <>
      <Navbar />

      <div className="container-atividade">
        <div className="conteudo-atividade">
          <h1>Atividades</h1>
          <p className="descricao-atividade">
            Escolha um exercício abaixo para praticar a leitura labial e a fala.
          </p>

          {carregando && <p className="descricao-atividade">Carregando unidades...</p>}
          {!carregando && erro && <p className="descricao-atividade">{erro}</p>}

          {!carregando && !erro && unidades.length === 0 && (
            <p className="descricao-atividade">Nenhuma unidade cadastrada ainda.</p>
          )}

          {!carregando &&
            !erro &&
            unidades.map((unidade) => {
              const temExercicio =
                unidade.fala.length +
                  unidade.atividadesFala.length +
                  unidade.video.length +
                  unidade.alternativa.length >
                0;

              return (
                <section key={unidade.id} className="unidade-bloco">
                  <h2>{unidade.nome}</h2>

                  {!temExercicio && (
                    <p className="descricao-atividade">Esta unidade ainda não tem exercícios.</p>
                  )}

                  {unidade.video.length > 0 && (
                    <div className="grupo-tipo-exercicio">
                      <h3>Vídeo-aulas</h3>
                      <div className="grid-cards">
                        {unidade.video.map((licao) => (
                          <CardExercicio
                            key={`v-${licao.id}`}
                            imagem={<img src={video} alt="Vídeo" />}
                            descricao={licao.texto}
                            onComecar={() => navigate(`/atividade/video/${licao.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {unidade.alternativa.length > 0 && (
                    <div className="grupo-tipo-exercicio">
                      <h3>Interpretação</h3>
                      <div className="grid-cards">
                        {unidade.alternativa.map((licao) => (
                          <CardExercicio
                            key={`a-${licao.id}`}
                            imagem={<img src={atividade} alt="Interpretação" />}
                            descricao={licao.texto}
                            onComecar={() => navigate(`/atividade/alternativa/${licao.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(unidade.atividadesFala.length > 0 || unidade.fala.length > 0) && (
                    <div className="grupo-tipo-exercicio">
                      <h3>Fala</h3>
                      <div className="grid-cards">
                        {unidade.atividadesFala.map((atividadeFala) => (
                          <CardExercicio
                            key={`af-${atividadeFala.id}`}
                            imagem={<img src={labios} alt="Pronúncia" />}
                            descricao={`${atividadeFala.nome} · ${atividadeFala.totalExercicios} exercício${atividadeFala.totalExercicios === 1 ? "" : "s"}`}
                            onComecar={() => navigate(`/atividade/fala-sessao/${atividadeFala.id}`)}
                          />
                        ))}

                        {unidade.fala.map((licao) => (
                          <CardExercicio
                            key={`f-${licao.id}`}
                            imagem={<img src={labios} alt="Pronúncia" />}
                            descricao={`Fale: "${licao.texto}"`}
                            onComecar={() => navigate(`/atividade/fala/${licao.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default TelaInicioAtividadeUnidade;
