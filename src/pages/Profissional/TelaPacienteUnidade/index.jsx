import Navbar from "../../../components/NavbarVoltar";
import BarrasDeDesempenho from "../../../components/BarrasDeDesempenho";
import InfoAtividade from "../../../components/InfoAtividades";
import { useTelaPacienteUnidade } from "./index.hook";
import "./index.css";

const TelaPacienteUnidade = () => {
  const { id, carregando, erro, nomePaciente, unidade, barrasUnidade, grupos } = useTelaPacienteUnidade();

  return (
    <div className="atividade-detalhe-page-container">
      <Navbar destino={`/paciente/${id}`} />

      <main className="atividade-detalhe-main-content">
        <div className="atividade-detalhe-card-background">
          {carregando && <p className="unidade-estado">Carregando desempenho da unidade...</p>}
          {!carregando && erro && <p className="unidade-estado">{erro}</p>}

          {!carregando && !erro && unidade && (
            <>
              <section className="atividade-detalhe-topo-card">
                <InfoAtividade
                  titulo={unidade.nome}
                  descricao={`${nomePaciente ? `${nomePaciente} · ` : ""}${unidade.concluidas} de ${unidade.total} atividades concluídas no nível ${unidade.nivel}.`}
                  badges={[unidade.nivel, `${unidade.total} atividades`]}
                  progresso={unidade.percentual}
                  semSalvar
                  limiteDescricao={220}
                  className="info-atividade--aberta"
                />
              </section>

              <div className="unidades-container-lista">
                <section className="unidade-desempenho-block">
                  <h2 className="unidade-titulo-sub">Desempenho na unidade</h2>
                  <div className="unidade-barras-wrapper">
                    <BarrasDeDesempenho dados={barrasUnidade} />
                  </div>
                  <p className="unidade-legenda">
                    Interpretação e Fala: % de acerto · Vídeo e Acompanhante: % concluído.
                  </p>
                </section>

                {grupos.map((grupo) => (
                  <section key={grupo.id} className="unidade-desempenho-block">
                    <h2 className="unidade-titulo-sub">{grupo.nome}</h2>
                    <div className="unidade-barras-wrapper">
                      <BarrasDeDesempenho
                        dados={[
                          { label: "Fala", acertos: grupo.acerto ?? 0, total: 100 },
                          { label: "Concluído", acertos: grupo.percentual, total: 100 },
                        ]}
                      />
                    </div>
                    <p className="unidade-legenda">
                      {grupo.nivel} · {grupo.concluidos} de {grupo.totalExercicios} exercícios concluídos
                      {grupo.acerto == null ? " · ainda sem tentativas" : ` · nota média ${grupo.notaMedia ?? "—"}%`}
                    </p>
                  </section>
                ))}

                {grupos.length === 0 && barrasUnidade.length === 0 && (
                  <p className="unidade-estado">Nenhuma atividade liberada nesta unidade para o nível do paciente.</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TelaPacienteUnidade;
