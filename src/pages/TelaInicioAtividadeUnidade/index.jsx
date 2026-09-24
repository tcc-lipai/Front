import { useNavigate } from "react-router-dom";
import { Mic, HelpCircle, Video as VideoIcon, Sparkles } from "lucide-react";
import CardExercicio from "../../components/CardExercicio";
import Navbar from "../../components/NavbarVoltar";
import { useTelaInicioAtividadeUnidade } from "./index.hook";

import "./index.css";

const TIPOS = {
  video: { titulo: "Vídeo-aulas", cor: "#4E8FD6", Icone: VideoIcon },
  alternativa: { titulo: "Interpretação", cor: "#E0932E", Icone: HelpCircle },
  fala: { titulo: "Fala", cor: "#8A3FA0", Icone: Mic },
};

const IconeTipo = ({ tipo }) => {
  const { cor, Icone } = TIPOS[tipo];
  return <Icone size={22} color={cor} strokeWidth={2.2} />;
};

const TelaInicioAtividadeUnidade = () => {
  const navigate = useNavigate();
  const { carregando, erro, unidades } = useTelaInicioAtividadeUnidade();

  return (
    <>
      <Navbar destino="/inicio-atividades" />

      <div className="container-atividade">
        <div className="conteudo-atividade">
          <div className="cabecalho-atividades">
            <h1>Trilha de Atividades</h1>
            <p className="descricao-atividade">
              Escolha uma unidade e pratique a leitura labial e a fala por tipo de exercício.
            </p>
          </div>

          {carregando && <p className="descricao-atividade">Carregando unidades...</p>}
          {!carregando && erro && <p className="descricao-atividade">{erro}</p>}

          {!carregando && !erro && unidades.length === 0 && (
            <p className="descricao-atividade">Nenhuma unidade cadastrada ainda.</p>
          )}

          {!carregando &&
            !erro &&
            unidades.map((unidade, indice) => {
              const temExercicio =
                unidade.fala.length +
                  unidade.atividadesFala.length +
                  unidade.video.length +
                  unidade.alternativa.length >
                0;

              return (
                <section key={unidade.id} className="unidade-bloco">
                  <div className="unidade-cabecalho">
                    <span className="unidade-numero">{indice + 1}</span>
                    <div>
                      <h2>{unidade.nome}</h2>
                      {!temExercicio && (
                        <p className="descricao-atividade">Esta unidade ainda não tem exercícios.</p>
                      )}
                    </div>
                  </div>

                  {unidade.video.length > 0 && (
                    <div className="grupo-tipo-exercicio">
                      <div className="grupo-tipo-cabecalho">
                        <IconeTipo tipo="video" />
                        <h3>{TIPOS.video.titulo}</h3>
                      </div>
                      <div className="grid-cards">
                        {unidade.video.map((licao) => (
                          <CardExercicio
                            key={`v-${licao.id}`}
                            imagem={<IconeTipo tipo="video" />}
                            descricao={licao.texto}
                            corDestaque={TIPOS.video.cor}
                            concluida={licao.concluida}
                            onComecar={() => navigate(`/atividade/video/${licao.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {unidade.alternativa.length > 0 && (
                    <div className="grupo-tipo-exercicio">
                      <div className="grupo-tipo-cabecalho">
                        <IconeTipo tipo="alternativa" />
                        <h3>{TIPOS.alternativa.titulo}</h3>
                      </div>
                      <div className="grid-cards">
                        {unidade.alternativa.map((licao) => (
                          <CardExercicio
                            key={`a-${licao.id}`}
                            imagem={<IconeTipo tipo="alternativa" />}
                            descricao={licao.texto}
                            corDestaque={TIPOS.alternativa.cor}
                            concluida={licao.concluida}
                            onComecar={() => navigate(`/atividade/alternativa/${licao.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(unidade.atividadesFala.length > 0 || unidade.fala.length > 0) && (
                    <div className="grupo-tipo-exercicio">
                      <div className="grupo-tipo-cabecalho">
                        <IconeTipo tipo="fala" />
                        <h3>{TIPOS.fala.titulo}</h3>
                      </div>
                      <div className="grid-cards">
                        {unidade.atividadesFala.map((atividadeFala) => (
                          <CardExercicio
                            key={`af-${atividadeFala.id}`}
                            imagem={<Sparkles size={22} color={TIPOS.fala.cor} strokeWidth={2.2} />}
                            titulo={atividadeFala.nome}
                            descricao={`${atividadeFala.totalExercicios} exercício${atividadeFala.totalExercicios === 1 ? "" : "s"}`}
                            corDestaque={TIPOS.fala.cor}
                            concluida={atividadeFala.concluida}
                            onComecar={() => navigate(`/atividade/fala-sessao/${atividadeFala.id}`)}
                          />
                        ))}

                        {unidade.fala.map((licao) => (
                          <CardExercicio
                            key={`f-${licao.id}`}
                            imagem={<IconeTipo tipo="fala" />}
                            descricao={`Fale: "${licao.texto}"`}
                            corDestaque={TIPOS.fala.cor}
                            concluida={licao.concluida}
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
