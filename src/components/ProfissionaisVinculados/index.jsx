import { UserRound, X } from "lucide-react";
import { useProfissionaisVinculados } from "./index.hook";
import "./index.css";

/**
 * Configurações do aluno: profissionais da saúde vinculados (até 3), com opção de
 * vincular por código e de desvincular.
 */
export default function ProfissionaisVinculados() {
  const h = useProfissionaisVinculados();

  return (
    <div className="prof-vinc">
      <div className="prof-vinc__topo">
        <h3 className="config-card-title">Profissionais vinculados</h3>
        <span className="prof-vinc__contador" aria-label="Profissionais vinculados">
          {h.profissionais.length}/{h.maximo}
        </span>
      </div>
      <p className="config-card-description">
        Os profissionais vinculados acompanham o seu desempenho nas atividades. Você pode ter até{" "}
        {h.maximo} vinculados ao mesmo tempo e pode remover um vínculo quando quiser.
      </p>

      {h.carregando && <p className="prof-vinc__vazio">Carregando...</p>}

      {!h.carregando && h.profissionais.length === 0 && (
        <p className="prof-vinc__vazio">Você ainda não tem nenhum profissional vinculado.</p>
      )}

      <ul className="prof-vinc__lista">
        {h.profissionais.map((p) => (
          <li key={p.id} className="prof-vinc__item">
            <span className="prof-vinc__avatar" aria-hidden="true">
              <UserRound size={20} />
            </span>
            <span className="prof-vinc__dados">
              <strong>{p.nome}</strong>
              <small>{p.registro ? `${p.email} · ${p.registro}` : p.email}</small>
            </span>
            <button
              type="button"
              className="prof-vinc__remover"
              onClick={() => h.setParaRemover(p)}
              aria-label={`Desvincular ${p.nome}`}
            >
              <X size={18} />
            </button>
          </li>
        ))}
      </ul>

      <form className="prof-vinc__form" onSubmit={h.vincular}>
        <input
          type="text"
          value={h.codigo}
          onChange={(e) => h.setCodigo(e.target.value)}
          placeholder={h.cheio ? "Limite de profissionais atingido" : "Código do profissional"}
          aria-label="Código do profissional"
          disabled={h.cheio || h.enviando}
          maxLength={20}
        />
        <button type="submit" disabled={h.cheio || h.enviando}>
          {h.enviando ? "Vinculando..." : "Vincular"}
        </button>
      </form>

      {h.mensagem && (
        <p
          className={`prof-vinc__msg prof-vinc__msg--${h.mensagem.tipo}`}
          role="status"
        >
          {h.mensagem.texto}
        </p>
      )}

      {h.paraRemover && (
        <div className="logout-modal-overlay" role="presentation" onClick={() => h.setParaRemover(null)}>
          <div
            className="logout-modal"
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="logout-modal-title">Desvincular profissional?</h2>
            <p className="logout-modal-text">
              {h.paraRemover.nome} deixará de ver o seu desempenho. Você pode vincular de novo depois
              com o código.
            </p>
            <div className="logout-modal-actions">
              <button type="button" className="logout-modal-cancel" onClick={() => h.setParaRemover(null)}>
                Cancelar
              </button>
              <button type="button" className="logout-modal-confirm" onClick={h.confirmarRemocao}>
                Desvincular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
