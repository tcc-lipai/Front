// src/pages/TelaInicioAtividades/index.types.js

/**
 * @typedef {'iniciante' | 'intermediario' | 'avancado'} Dificuldade
 * @typedef {'realizado' | 'emAndamento' | 'concluido' | null} StatusAtividade
 */

/**
 * @typedef {Object} Atividade
 * @property {number}          id
 * @property {string}          titulo
 * @property {string}          descricao
 * @property {string}          [imagem]       - URL da imagem de capa
 * @property {Dificuldade}     dificuldade
 * @property {StatusAtividade} status
 * @property {number}          progresso      - 0 a 100 (percentual)
 */

/**
 * @typedef {Object} FiltroState
 * @property {string} busca
 * @property {{ iniciante: boolean, intermediario: boolean, avancado: boolean }} dificuldade
 * @property {{ realizado: boolean, emAndamento: boolean, concluido: boolean }} status
 */
