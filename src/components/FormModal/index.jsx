import { useEffect, useState } from "react";
import Botao from "../Botao";
import "./index.css";

/**
 * Formulário genérico em modal.
 * @param {boolean} isOpen
 * @param {string} titulo
 * @param {{name, label, type?, options?, required?, placeholder?, textarea?}[]} campos
 * @param {object} valoresIniciais
 * @param {(valores) => Promise<{sucesso, mensagem?}>} onSalvar
 * @param {() => void} onFechar
 */
const FormModal = ({ isOpen, titulo, campos, valoresIniciais = {}, onSalvar, onFechar }) => {
  const [valores, setValores] = useState(valoresIniciais);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValores(valoresIniciais);
      setErro("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const alterar = (e) => {
    const { name, value } = e.target;
    setValores((atual) => ({ ...atual, [name]: value }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    const faltando = campos.find((c) => c.required && (valores[c.name] === "" || valores[c.name] == null));
    if (faltando) {
      setErro(`Preencha o campo "${faltando.label}".`);
      return;
    }
    setEnviando(true);
    const res = await onSalvar(valores);
    setEnviando(false);
    if (!res.sucesso) {
      setErro(res.mensagem);
      return;
    }
    onFechar();
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={enviar}>
        <button type="button" className="modal-close-x" onClick={onFechar} aria-label="Fechar">
          &times;
        </button>
        <h2 className="form-modal__titulo">{titulo}</h2>

        {campos.map((campo) => (
          <label key={campo.name} className="form-modal__campo">
            <span>
              {campo.label}
              {campo.required ? " *" : ""}
            </span>
            {campo.options ? (
              <select name={campo.name} value={valores[campo.name] ?? ""} onChange={alterar}>
                <option value="">Selecione</option>
                {campo.options.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : campo.textarea ? (
              <textarea
                name={campo.name}
                rows={3}
                placeholder={campo.placeholder}
                value={valores[campo.name] ?? ""}
                onChange={alterar}
              />
            ) : (
              <input
                type={campo.type || "text"}
                name={campo.name}
                placeholder={campo.placeholder}
                value={valores[campo.name] ?? ""}
                onChange={alterar}
              />
            )}
          </label>
        ))}

        {erro && <p className="form-modal__erro">{erro}</p>}

        <div className="form-modal__acoes">
          <Botao texto="Cancelar" variante="secundario" onClick={onFechar} />
          <Botao texto={enviando ? "Salvando..." : "Salvar"} type="submit" disabled={enviando} />
        </div>
      </form>
    </div>
  );
};

export default FormModal;
