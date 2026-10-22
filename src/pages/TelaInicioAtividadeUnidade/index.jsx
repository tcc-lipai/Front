import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, HelpCircle, Video as VideoIcon, Sparkles, Heart, TrendingUp, ChevronDown } from "lucide-react";
import CardExercicio from "../../components/CardExercicio";
import Botao from "../../components/Botao";
import Navbar from "../../components/NavbarVoltar";
import DicaFonemaModal from "../../components/DicaFonemaModal";
import { nomeNivelDificuldade } from "../../services/usuarioService";
import { useTelaInicioAtividadeUnidade } from "./index.hook";

import "./index.css";

const TIPOS = {
  video: { titulo: "Vídeo-aulas", cor: "#4E8FD6", Icone: VideoIcon },
  alternativa: { titulo: "Interpretação", cor: "#E0932E", Icone: HelpCircle },
  fala: { titulo: "Fala", cor: "#8A3FA0", Icone: Mic },
  vibracao: { titulo: "Acompanhante", cor: "#D65C8A", Icone: Heart },
};

const IconeTipo = ({ tipo }) => {
  const { cor, Icone } = TIPOS[tipo];
  return <Icone size={22} color={cor} strokeWidth={2.2} />;
};

/** Título de seção com a média de acerto (Fala/Interpretação) ou % concluído (Vídeo/Acompanhante) ao lado. */
const TituloComMedia = ({ titulo, acerto, concluido }) => (
  <h3>
    {titulo}
    {acerto != null && <span className="grupo-tipo-media"> · {acerto}% de acerto</span>}
    {acerto == null && concluido != null && (
      <span className="grupo-tipo-media"> · {concluido}% concluído</span>
    )}
  </h3>
);

const TelaInicioAtividadeUnidade = () => {
  const navigate = useNavigate();
  const {
    carregando,
    erro,
    unidades,
    alternarUnidade,
    nivelUsuario,
    comecarComDica,
    dica,
    fecharDica,
    elegibilidade,
    subindoNivel,
    confirmarSubirNivel,
    resultadoNivel,
    fecharResultadoNivel,
  } = useTelaInicioAtividadeUnidade();

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
            {nivelUsuario === 1 && (
              <p className="descricao-atividade">
                Seu nível ainda é Iniciante: por enquanto só as atividades de Acompanhante estão
                liberadas. As demais abrem a partir do nível Básico.
              </p>
            )}

            {elegibilidade?.elegivel && (
              <div className="banner-subir-nivel">
                <TrendingUp size={20} />
                <span>
                  Você completou o nível {nomeNivelDificuldade(elegibilidade.nivelAtual)} com nota
                  suficiente! Pode subir pra {nomeNivelDificuldade(elegibilidade.proximoNivel)}.
                </span>
                <Botao
                  texto={subindoNivel ? "Subindo..." : "Subir de nível"}
                  onClick={confirmarSubirNivel}
                  disabled={subindoNivel}
                />
              </div>
            )}
          </div>

          {carregando && <p className="descricao-atividade">Carregando unidades...</p>}
          {!carregando && erro && <p className="descricao-atividade">{erro}</p>}

          {!carregando && !erro && unidades.length === 0 && (
            <p className="descricao-atividade">Nenhuma unidade cadastrada ainda.</p>
          )}

          {!carregando &&
            !erro &&
            unidades.map((resumo, indice) => {
              const unidade = resumo.dados;
              if (!unidade) {
                return (
                  <section key={resumo.id} className="unidade-bloco">
                    <button
                      type="button"
                      className="unidade-cabecalho unidade-cabecalho-botao"
                      onClick={() => alternarUnidade(resumo.id)}
                      aria-expanded={resumo.aberta}
                    >
                      <span className="unidade-numero">{indice + 1}</span>
                      <h2>{resumo.nome}</h2>
                      <ChevronDown size={20} className={resumo.aberta ? "unidade-seta aberta" : "unidade-seta"} />
                    </button>
                    {resumo.aberta && resumo.carregando && (
                      <p className="descricao-atividade">Carregando exercícios...</p>
                    )}
                    {resumo.aberta && resumo.erro && <p className="descricao-atividade">{resumo.erro}</p>}
                  </section>
                );
              }

              const mostrarVibracao = unidade.vibracao.length > 0;
              const mostrarVideo = unidade.video.length > 0;
              const mostrarAlternativa = unidade.alternativa.length > 0;
              const mostrarFala = unidade.atividadesFala.length > 0 || unidade.fala.length > 0;

              const temExercicio = mostrarVibracao || mostrarVideo || mostrarAlternativa || mostrarFala;
              const d = unidade.desempenho;

              return (
                <section key={unidade.id} className="unidade-bloco">
                  <button
                    type="button"
                    className="unidade-cabecalho unidade-cabecalho-botao"
                    onClick={() => alternarUnidade(unidade.id)}
                    aria-expanded={resumo.aberta}
                  >
                    <span className="unidade-numero">{indice + 1}</span>
                    <div>
                      <h2>
                        {unidade.nome}
                        {d?.acertoGeralUnidade != null && (
                          <span className="unidade-media"> · {d.acertoGeralUnidade}% de acerto</span>
                        )}
                      </h2>
                      {resumo.aberta && !temExercicio && (
                        <p className="descricao-atividade">
                          Esta unidade ainda não tem exercícios liberados pro seu nível.
                        </p>
                      )}
                    </div>
                    <ChevronDown size={20} className={resumo.aberta ? "unidade-seta aberta" : "unidade-seta"} />
                  </button>

                  <AnimatePresence>
                    {resumo.aberta && (
                      <motion.div
                        key="conteudo"
                        className="unidade-conteudo"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      >
                  {mostrarVibracao && (
                    <div className="grupo-tipo-exercicio">
                      <div className="grupo-tipo-cabecalho">
                        <IconeTipo tipo="vibracao" />
                        <TituloComMedia titulo={TIPOS.vibracao.titulo} acerto={null} concluido={d?.concluidoVibracao} />
                      </div>
                      <div className="grid-cards">
                        {unidade.vibracao.map((licao) => (
                          <CardExercicio
                            key={`vb-${licao.id}`}
                            imagem={<IconeTipo tipo="vibracao" />}
                            descricao={`Sílaba: "${licao.texto}"`}
                            corDestaque={TIPOS.vibracao.cor}
                            concluida={licao.concluida}
                            onComecar={() =>
                              comecarComDica(unidade, () =>
                                navigate(`/atividade/acompanhante/${licao.id}`)
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {mostrarVideo && (
                    <div className="grupo-tipo-exercicio">
                      <div className="grupo-tipo-cabecalho">
                        <IconeTipo tipo="video" />
                        <TituloComMedia titulo={TIPOS.video.titulo} acerto={null} concluido={d?.concluidoVideo} />
                      </div>
                      <div className="grid-cards">
                        {unidade.video.map((licao) => (
                          <CardExercicio
                            key={`v-${licao.id}`}
                            imagem={<IconeTipo tipo="video" />}
                            descricao={licao.texto}
                            corDestaque={TIPOS.video.cor}
                            concluida={licao.concluida}
                            onComecar={() =>
                              comecarComDica(unidade, () => navigate(`/atividade/video/${licao.id}`))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {mostrarAlternativa && (
                    <div className="grupo-tipo-exercicio">
                      <div className="grupo-tipo-cabecalho">
                        <IconeTipo tipo="alternativa" />
                        <TituloComMedia titulo={TIPOS.alternativa.titulo} acerto={d?.acertoInterpretacao} />
                      </div>
                      <div className="grid-cards">
                        {unidade.alternativa.map((licao) => (
                          <CardExercicio
                            key={`a-${licao.id}`}
                            imagem={<IconeTipo tipo="alternativa" />}
                            descricao={licao.texto}
                            corDestaque={TIPOS.alternativa.cor}
                            concluida={licao.concluida}
                            acerto={licao.acerto}
                            onComecar={() =>
                              comecarComDica(unidade, () =>
                                navigate(`/atividade/alternativa/${licao.id}`)
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {mostrarFala && (
                    <div className="grupo-tipo-exercicio">
                      <div className="grupo-tipo-cabecalho">
                        <IconeTipo tipo="fala" />
                        <TituloComMedia titulo={TIPOS.fala.titulo} acerto={d?.acertoFala} />
                      </div>
                      <div className="grid-cards">
                        {unidade.atividadesFala.map((atividadeFala) => (
                          <CardExercicio
                            key={`af-${atividadeFala.id}`}
                            imagem={<Sparkles size={22} color={TIPOS.fala.cor} strokeWidth={2.2} />}
                            titulo={atividadeFala.nome}
                            descricao={`${atividadeFala.nivel} · ${atividadeFala.totalExercicios} exercício${atividadeFala.totalExercicios === 1 ? "" : "s"}`}
                            corDestaque={TIPOS.fala.cor}
                            concluida={atividadeFala.concluida}
                            acerto={atividadeFala.acerto}
                            onComecar={() =>
                              comecarComDica(unidade, () =>
                                navigate(`/atividade/fala-sessao/${atividadeFala.id}`)
                              )
                            }
                          />
                        ))}

                        {unidade.fala.map((licao) => (
                          <CardExercicio
                            key={`f-${licao.id}`}
                            imagem={<IconeTipo tipo="fala" />}
                            descricao={`Fale: "${licao.texto}"`}
                            corDestaque={TIPOS.fala.cor}
                            concluida={licao.concluida}
                            acerto={licao.acerto}
                            onComecar={() =>
                              comecarComDica(unidade, () => navigate(`/atividade/fala/${licao.id}`))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              );
            })}
        </div>
      </div>

      <DicaFonemaModal
        fonema={dica?.fonema ?? null}
        onContinuar={dica?.aoContinuar ?? (() => {})}
        onFechar={fecharDica}
      />

      {resultadoNivel && (
        <div className="modal-overlay" onClick={fecharResultadoNivel}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={fecharResultadoNivel} aria-label="Fechar">
              &times;
            </button>
            {resultadoNivel.sucesso ? (
              <>
                <h2 className="modal-title">Parabéns, você subiu de nível!</h2>
                <p className="descricao-atividade" style={{ textAlign: "center" }}>
                  Seu novo nível é {nomeNivelDificuldade(resultadoNivel.novoNivel)}. Novas
                  atividades acabaram de ser liberadas.
                </p>
              </>
            ) : (
              <>
                <h2 className="modal-title">Ainda não dá pra subir de nível</h2>
                <p className="descricao-atividade" style={{ textAlign: "center" }}>
                  {resultadoNivel.mensagem}
                </p>
              </>
            )}
            <div className="modal-actions">
              <Botao texto="Entendi" onClick={fecharResultadoNivel} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TelaInicioAtividadeUnidade;
