import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import "./index.css";

/**
 * Exibe um toast animado quando uma conquista é desbloqueada.
 * Props:
 *   conquistas: string[] — lista de nomes de conquistas recém-ganhas
 *   onDismiss: () => void — chamado quando todos os toasts somem
 */
export default function ConquistaToast({ conquistas = [], onDismiss }) {
  const [visivel, setVisivel] = useState(false);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (conquistas.length === 0) return;
    setIndice(0);
    setVisivel(true);
  }, [conquistas]);

  useEffect(() => {
    if (!visivel) return;

    const timer = setTimeout(() => {
      if (indice < conquistas.length - 1) {
        setIndice((i) => i + 1);
      } else {
        setVisivel(false);
        onDismiss?.();
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [visivel, indice, conquistas, onDismiss]);

  if (!visivel || conquistas.length === 0) return null;

  return (
    <div className="conquista-toast" role="alert" aria-live="polite">
      <div className="conquista-toast__icone">
        <Trophy size={28} />
      </div>
      <div className="conquista-toast__texto">
        <span className="conquista-toast__label">Conquista desbloqueada! 🏆</span>
        <strong className="conquista-toast__nome">{conquistas[indice]}</strong>
      </div>
    </div>
  );
}
