// src/pages/TelaInicioAtividadeUnidade/index.jsx
import { ArrowLeft, CheckCircle, Lock, Clock, BookOpen, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import { useTelaInicioAtividadeUnidade } from './index.hook';
import './index.css';

const STATUS_CONFIG = {
  concluido:   { label: 'Concluído',    classe: 'concluido'   },
  emAndamento: { label: 'Em andamento', classe: 'emAndamento' },
  disponivel:  { label: 'Disponível',   classe: 'disponivel'  },
  bloqueado:   { label: 'Bloqueado',    classe: 'bloqueado'   },
};

const TelaIncioAtividadeUnidade = () => {
  const {
    unidades,
    unidadeSelecionada,
    proximaUnidade,
    totalProgresso,
    handleSelecionarUnidade,
    handleIniciarUnidade,
    handleVoltar,
  } = useTelaInicioAtividadeUnidade();

  return (
    <div className="unidades">
      {/* Cabeçalho */}
      <header className="unidades__header">
        <nav className="unidades__header-nav" aria-label="Navegação de volta">
          <button
            className="unidades__voltar"
            onClick={handleVoltar}
            aria-label="Voltar para a lista de atividades"
          >
            <ArrowLeft size={14} />
            Voltar
          </button>
          <span className="unidades__breadcrumb" aria-hidden="true">
            Atividades / Unidades
          </span>
        </nav>

        <div className="unidades__header-info">
          <div>
            <h1 className="unidades__titulo">Unidades</h1>
            <p className="unidades__subtitulo">
              Selecione uma unidade para continuar seu aprendizado de leitura labial
            </p>
          </div>

          {/* Progresso geral */}
          <div className="unidades__progresso-geral" aria-label={`Progresso geral: ${totalProgresso}%`}>
            <div className="unidades__progresso-geral-topo">
              <span className="unidades__progresso-geral-label">Progresso geral</span>
              <span className="unidades__progresso-geral-valor">{totalProgresso}%</span>
            </div>
            <div className="unidades__progresso-bar" role="progressbar" aria-valuenow={totalProgresso} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="unidades__progresso-fill"
                style={{ width: `${totalProgresso}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="unidades__main">
        {/* Próxima unidade em destaque */}
        {proximaUnidade && (
          <div
            className="unidades__proxima"
            role="region"
            aria-label="Próxima unidade recomendada"
          >
            <div className="unidades__proxima-info">
              <span className="unidades__proxima-badge">
                {proximaUnidade.status === 'emAndamento' ? '▶ Continuar' : '✦ Próxima unidade'}
              </span>
              <span className="unidades__proxima-titulo">
                {proximaUnidade.icone} {proximaUnidade.titulo}
              </span>
              <span className="unidades__proxima-desc">{proximaUnidade.descricao}</span>
            </div>
            <button
              className="unidades__proxima-btn"
              onClick={() => handleIniciarUnidade(proximaUnidade)}
              aria-label={`${proximaUnidade.status === 'emAndamento' ? 'Continuar' : 'Iniciar'} unidade ${proximaUnidade.titulo}`}
            >
              {proximaUnidade.status === 'emAndamento' ? 'Continuar' : 'Iniciar'}
            </button>
          </div>
        )}

        {/* Lista de unidades */}
        <h2 className="unidades__lista-titulo">Todas as unidades</h2>
        <ol className="unidades__lista" aria-label="Lista de unidades">
          {unidades.map((unidade) => {
            const statusInfo = STATUS_CONFIG[unidade.status];
            const selecionado = unidadeSelecionada?.id === unidade.id;
            const bloqueado = unidade.status === 'bloqueado';

            return (
              <li key={unidade.id}>
                <article
                  className={[
                    'unidades__card',
                    selecionado ? 'unidades__card--selecionado' : '',
                    bloqueado ? 'unidades__card--bloqueado' : '',
                    unidade.status === 'concluido' ? 'unidades__card--concluido' : '',
                  ].filter(Boolean).join(' ')}
                  tabIndex={bloqueado ? -1 : 0}
                  role="button"
                  aria-expanded={selecionado}
                  aria-disabled={bloqueado}
                  aria-label={`Unidade ${unidade.numero}: ${unidade.titulo}. Status: ${statusInfo.label}.${unidade.progresso > 0 ? ` Progresso: ${unidade.progresso}%.` : ''}`}
                  onClick={() => handleSelecionarUnidade(unidade)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !bloqueado) {
                      e.preventDefault();
                      handleSelecionarUnidade(unidade);
                    }
                  }}
                >
                  {/* Ícone */}
                  <div
                    className={[
                      'unidades__card-icone',
                      unidade.status === 'concluido' ? 'unidades__card-icone--concluido' : '',
                      bloqueado ? 'unidades__card-icone--bloqueado' : '',
                    ].filter(Boolean).join(' ')}
                    aria-hidden="true"
                  >
                    {bloqueado ? (
                      <Lock size={18} color="#9ca3af" />
                    ) : unidade.status === 'concluido' ? (
                      <CheckCircle size={20} color="#059669" />
                    ) : (
                      unidade.icone
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="unidades__card-conteudo">
                    <div className="unidades__card-topo">
                      <span className="unidades__card-numero">Unidade {unidade.numero}</span>
                      <span className={`unidades__card-status unidades__card-status--${statusInfo.classe}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="unidades__card-titulo">{unidade.titulo}</h3>
                    <p className="unidades__card-desc">{unidade.descricao}</p>

                    <div className="unidades__card-footer">
                      <div className="unidades__card-meta">
                        <span className="unidades__card-licoes" aria-label={`${unidade.licoesFeitas} de ${unidade.totalLicoes} lições`}>
                          <BookOpen size={12} aria-hidden="true" />
                          {unidade.licoesFeitas}/{unidade.totalLicoes} lições
                        </span>
                        {unidade.tempoEstimado && (
                          <span className="unidades__card-tempo" aria-label={`Tempo estimado: ${unidade.tempoEstimado}`}>
                            <Clock size={12} aria-hidden="true" />
                            {unidade.tempoEstimado}
                          </span>
                        )}
                      </div>

                      {unidade.progresso > 0 && (
                        <div className="unidades__card-progresso" aria-label={`Progresso: ${unidade.progresso}%`}>
                          <div
                            className="unidades__card-progresso-bar"
                            role="progressbar"
                            aria-valuenow={unidade.progresso}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="unidades__card-progresso-fill"
                              style={{ width: `${unidade.progresso}%` }}
                            />
                          </div>
                          <span className="unidades__card-progresso-valor">{unidade.progresso}%</span>
                        </div>
                      )}
                    </div>

                    {/* Ação expandida */}
                    {selecionado && !bloqueado && (
                      <div className="unidades__card-acao">
                        <button
                          className="unidades__card-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIniciarUnidade(unidade);
                          }}
                          aria-label={`${unidade.status === 'emAndamento' ? 'Continuar' : unidade.status === 'concluido' ? 'Revisar' : 'Iniciar'} unidade ${unidade.titulo}`}
                        >
                          <PlayCircle size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} aria-hidden="true" />
                          {unidade.status === 'emAndamento'
                            ? 'Continuar'
                            : unidade.status === 'concluido'
                            ? 'Revisar'
                            : 'Iniciar'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ícone de expansão */}
                  {!bloqueado && (
                    <span aria-hidden="true" style={{ color: '#9ca3af', flexShrink: 0, marginTop: 2 }}>
                      {selecionado ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
};

export default TelaIncioAtividadeUnidade;
