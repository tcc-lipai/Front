import React from "react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { FEEDBACK_TYPES } from "./index.types";
import estrelaIcon from "../../assets/img/estrela.png";
import "./index.css";

const ICONE_POR_TIPO = {
  [FEEDBACK_TYPES.SUCCESS]: CheckCircle2,
  [FEEDBACK_TYPES.ERROR]: XCircle,
  [FEEDBACK_TYPES.DEFAULT]: Sparkles,
};

const FeedbackCard = ({
  isOpen,
  onClose,
  text,
  type = FEEDBACK_TYPES.DEFAULT,
  stars,
  percentage,
  fonemas,
  onNext,
  onRetry,
}) => {
  const handleNextClick = () => {
    if (onNext) onNext();
    onClose();
  };

  const handleRetryClick = () => {
    if (onRetry) onRetry();
    onClose();
  };

  const Icone = ICONE_POR_TIPO[type] || Sparkles;

  return (
    <div className={`feedback-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className={`feedback-container ${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="feedback-conteudo">
          <div className={`feedback-icone feedback-icone--${type}`}>
            <Icone size={28} />
          </div>

          <div className="feedback-texto">
            <h2 className="feedback-header">Feedback</h2>
            <p className="feedback-content">{text}</p>
          </div>

          {(stars != null || percentage != null) && (
            <div className="feedback-stats">
              {percentage != null && (
                <div className="feedback-stat-card">
                  <span className="feedback-stat-card__valor">{percentage}%</span>
                  <span className="feedback-stat-card__rotulo">precisão</span>
                </div>
              )}
              {stars != null && (
                <div className="feedback-stat-card">
                  <span className="feedback-stat-card__valor feedback-stat-card__valor--moedas">
                    <img src={estrelaIcon} alt="Estrela" className="feedback-stars__icon" />
                    +{stars}
                  </span>
                  <span className="feedback-stat-card__rotulo">moedas</span>
                </div>
              )}
            </div>
          )}

          {Array.isArray(fonemas) && fonemas.length > 0 && (
            <div className="feedback-fonemas-bloco">
              <span className="feedback-fonemas-rotulo">Desempenho por som</span>
              <div className="feedback-fonemas" aria-label="Desempenho por som">
                {fonemas.map((fonema, indice) => (
                  <span
                    key={`${fonema.caractere}-${indice}`}
                    className={`feedback-fonema feedback-fonema--${fonema.status || "atencao"}`}
                    title={`${Math.round(fonema.score ?? 0)}%`}
                  >
                    {fonema.caractere}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="feedback-footer">
            {onRetry && (
              <button
                className="feedback-button feedback-button--secundario"
                onClick={handleRetryClick}
              >
                Refazer
              </button>
            )}
            <button className="feedback-button" onClick={handleNextClick}>
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
