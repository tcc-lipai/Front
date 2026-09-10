import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./index.css";

/**
 * Botão de filtro com menu suspenso.
 *
 * @param {string} rotulo       texto quando nada está selecionado (ex: "Nível")
 * @param {string} valor        valor selecionado atual ("" = nenhum)
 * @param {{valor: string, rotulo: string}[]} opcoes
 * @param {(valor: string) => void} aoSelecionar
 */
const DropdownFiltro = ({ rotulo, valor, opcoes, aoSelecionar }) => {
  const [aberto, setAberto] = useState(false);

  const selecionar = (novoValor) => {
    aoSelecionar(novoValor);
    setAberto(false);
  };

  return (
    <div className="dropdown-filtro">
      <button
        type="button"
        className="dropdown-filtro__botao"
        onClick={() => setAberto((estado) => !estado)}
        aria-expanded={aberto}
      >
        {valor || rotulo}
        <ChevronDown size={16} />
      </button>

      {aberto && (
        <ul className="dropdown-filtro__menu" role="listbox">
          {opcoes.map((opcao) => (
            <li
              key={opcao.valor || "todos"}
              className="dropdown-filtro__item"
              role="option"
              aria-selected={valor === opcao.valor}
              onClick={() => selecionar(opcao.valor)}
            >
              {opcao.rotulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownFiltro;
