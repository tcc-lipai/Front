import { useState } from "react";
import { Accessibility, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useAcessibilidade } from "../../hooks/useAcessibilidade";
import "./index.css";

const LABEL_NIVEL = {
  normal: "Normal",
  grande: "Grande",
  maior: "Maior",
  maximo: "Máximo",
};

const WidgetAcessibilidade = () => {
  const [aberto, setAberto] = useState(false);
  const {
    tamanhoTexto,
    podeAumentar,
    podeDiminuir,
    aumentarTexto,
    diminuirTexto,
    altoContraste,
    toggleAltoContraste,
    resetarAcessibilidade,
  } = useAcessibilidade();

  return (
    <div className="widget-acessibilidade">
      {aberto && (
        <div className="widget-acessibilidade__painel" role="dialog" aria-label="Opções de acessibilidade">
          <div className="widget-acessibilidade__cabecalho">
            <strong>Acessibilidade</strong>
            <button
              type="button"
              className="widget-acessibilidade__fechar"
              onClick={() => setAberto(false)}
              aria-label="Fechar opções de acessibilidade"
            >
              <X size={16} />
            </button>
          </div>

          <div className="widget-acessibilidade__item">
            <span>Tamanho do texto</span>
            <div className="widget-acessibilidade__controle-fonte">
              <button
                type="button"
                onClick={diminuirTexto}
                disabled={!podeDiminuir}
                aria-label="Diminuir tamanho do texto"
              >
                <Minus size={14} />
              </button>
              <span className="widget-acessibilidade__valor-fonte">{LABEL_NIVEL[tamanhoTexto]}</span>
              <button
                type="button"
                onClick={aumentarTexto}
                disabled={!podeAumentar}
                aria-label="Aumentar tamanho do texto"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="widget-acessibilidade__item">
            <span>Alto contraste</span>
            <label className="widget-acessibilidade__switch">
              <input
                type="checkbox"
                checked={altoContraste}
                onChange={toggleAltoContraste}
                aria-label="Ativar alto contraste"
              />
              <span className="widget-acessibilidade__trilho" />
            </label>
          </div>

          <button
            type="button"
            className="widget-acessibilidade__resetar"
            onClick={resetarAcessibilidade}
          >
            <RotateCcw size={13} />
            Restaurar padrão
          </button>
        </div>
      )}

      <button
        type="button"
        className="widget-acessibilidade__botao"
        onClick={() => setAberto((valor) => !valor)}
        aria-label="Abrir opções de acessibilidade"
        aria-expanded={aberto}
      >
        <Accessibility size={24} />
      </button>
    </div>
  );
};

export default WidgetAcessibilidade;
