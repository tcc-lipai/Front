// src/pages/TelaInicioAtividadeUnidade/index.types.js

/**
 * @typedef {'bloqueado' | 'disponivel' | 'emAndamento' | 'concluido'} StatusUnidade
 */

/**
 * @typedef {Object} Unidade
 * @property {number}        id
 * @property {number}        numero          - Número de ordem da unidade
 * @property {string}        titulo
 * @property {string}        descricao
 * @property {StatusUnidade} status
 * @property {number}        progresso       - 0 a 100 (percentual)
 * @property {number}        totalLicoes     - Total de lições na unidade
 * @property {number}        licoesFeitas    - Lições já concluídas
 * @property {string}        [icone]         - Emoji ou ícone representativo
 * @property {string}        [tempoEstimado] - Ex: "15 min"
 */

/**
 * @typedef {Object} AtividadeInfo
 * @property {number} id
 * @property {string} titulo
 * @property {string} descricao
 * @property {string} [imagemUrl]
 */

/**
 * @typedef {Object} TelaUnidadesState
 * @property {Unidade[]}          unidades
 * @property {Unidade | null}     unidadeSelecionada
 * @property {boolean}            carregando
 */
