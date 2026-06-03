// src/pages/TelaDicionario/index.types.js

/**
 * @typedef {'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
 *          | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
 *          | '#'} LetraIndex
 */

/**
 * @typedef {'substantivo' | 'verbo' | 'adjetivo' | 'expressao' | 'cumprimento'} CategoriaPalavra
 */

/**
 * @typedef {Object} PalavraItem
 * @property {number}          id
 * @property {string}          palavra         - Palavra ou expressão
 * @property {string}          descricao       - Descrição/significado
 * @property {string}          [videoUrl]      - URL do vídeo demonstrativo (opcional)
 * @property {string}          [imagemUrl]     - URL da imagem ilustrativa (opcional)
 * @property {CategoriaPalavra} categoria
 * @property {string}          [dica]          - Dica de leitura labial
 * @property {boolean}         favorito        - Se o usuário marcou como favorito
 */

/**
 * @typedef {Object} TelaDicionarioState
 * @property {string}           busca
 * @property {LetraIndex | ''}  letraAtiva      - Letra selecionada no índice alfabético
 * @property {CategoriaPalavra | ''} categoriaAtiva
 * @property {boolean}          apenasFlavoritos
 */
