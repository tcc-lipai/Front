// src/components/Filtro/index.types.js

/**
 * @typedef {'iniciante' | 'intermediario' | 'avancado'} Dificuldade
 * @typedef {'realizado' | 'emAndamento' | 'concluido'} StatusAtividade
 */

/**
 * @typedef {Object} FiltroState
 * @property {string} busca                                                        - Texto de busca livre
 * @property {{ iniciante: boolean, intermediario: boolean, avancado: boolean }} dificuldade
 * @property {{ realizado: boolean, emAndamento: boolean, concluido: boolean }} status
 */

/**
 * @typedef {Object} FiltroProps
 * @property {(filtro: FiltroState) => void} onFiltroChange  - Callback chamado ao mudar qualquer filtro
 * @property {FiltroState} [valorInicial]                    - Estado inicial opcional
 */
