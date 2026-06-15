// src/pages/TelaInicioAtividades/index.jsx
import Filtro from '../../components/Filtro';
import { useTelaInicioAtividades } from './index.hook';
import './index.css';

/** Mapeamento de status para label e classe CSS */
const STATUS_CONFIG = {
  concluido:   { label: 'Concluído',    classe: 'concluido'   },
  emAndamento: { label: 'Em andamento', classe: 'emAndamento' },
  realizado:   { label: 'Realizado',    classe: 'realizado'   },
  null:        { label: 'Novo',         classe: 'novo'        },
};

const DIFICULDADE_LABEL = {
  iniciante:     'Iniciante',
  intermediario: 'Intermediário',
  avancado:      'Avançado',
};

const TelaInicioAtividades = () => {
  const { atividadesFiltradas, handleFiltroChange, handleIniciar } =
    useTelaInicioAtividades();

  return (
    <div className="tela-atividades">

      {/* Conteúdo principal */}
      <main className="tela-atividades__main" aria-label="Lista de atividades">
        <h1 className="tela-atividades__titulo">Atividades</h1>
        <p className="tela-atividades__subtitulo">
          Escolha uma atividade para começar ou continuar seu treino de leitura labial.
        </p>

        {atividadesFiltradas.length > 0 ? (
          <div
            className="tela-atividades__grid"
            role="list"
            aria-label="Atividades disponíveis"
          >
            {atividadesFiltradas.map((atividade) => {
              const statusKey = atividade.status ?? 'null';
              const statusInfo = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG['null'];

              return (
                <article
                  className="atividade-card"
                  key={atividade.id}
                  role="listitem"
                  aria-label={`${atividade.titulo}, dificuldade ${DIFICULDADE_LABEL[atividade.dificuldade]}, ${statusInfo.label}, progresso ${atividade.progresso}%`}
                >
                  {/* Thumbnail */}
                  <div className="atividade-card__thumb" aria-hidden="true">
                    {atividade.imagem ? (
                      <img src={atividade.imagem} alt={`Capa da atividade ${atividade.titulo}`} />
                    ) : (
                      <span className="atividade-card__thumb-placeholder" aria-hidden="true">🎯</span>
                    )}
                  </div>

                  {/* Corpo */}
                  <div className="atividade-card__body">
                    {/* Título + Badge dificuldade */}
                    <div className="atividade-card__top">
                      <h2 className="atividade-card__titulo">{atividade.titulo}</h2>
                      <span
                        className={`atividade-card__badge atividade-card__badge--${atividade.dificuldade}`}
                        aria-label={`Dificuldade: ${DIFICULDADE_LABEL[atividade.dificuldade]}`}
                      >
                        {DIFICULDADE_LABEL[atividade.dificuldade]}
                      </span>
                    </div>

                    {/* Descrição */}
                    <p className="atividade-card__desc">{atividade.descricao}</p>

                    {/* Barra de progresso */}
                    <div className="atividade-card__progresso" aria-label={`Progresso: ${atividade.progresso}%`}>
                      <div className="atividade-card__progresso-topo">
                        <span className="atividade-card__progresso-label" aria-hidden="true">Progresso</span>
                        <span className="atividade-card__progresso-valor" aria-hidden="true">{atividade.progresso}%</span>
                      </div>
                      <div
                        className="atividade-card__progresso-bar"
                        role="progressbar"
                        aria-valuenow={atividade.progresso}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${atividade.progresso}% concluído`}
                      >
                        <div
                          className="atividade-card__progresso-fill"
                          style={{ width: `${atividade.progresso}%` }}
                        />
                      </div>
                    </div>

                    {/* Rodapé: status + botão */}
                    <div className="atividade-card__footer">
                      <span className={`atividade-card__status atividade-card__status--${statusInfo.classe}`}>
                        {statusInfo.label}
                      </span>
                      <button
                        className="atividade-card__btn"
                        onClick={() => handleIniciar(atividade.id)}
                        aria-label={`${atividade.progresso > 0 ? 'Continuar' : 'Iniciar'} atividade ${atividade.titulo}`}
                      >
                        {atividade.progresso > 0 ? 'Continuar' : 'Iniciar'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="tela-atividades__vazio" role="status" aria-live="polite">
            Nenhuma atividade encontrada com os filtros selecionados.
          </div>
        )}
      </main>
      <Filtro onFiltroChange={handleFiltroChange} />
    </div>
  );
};

export default TelaInicioAtividades;
