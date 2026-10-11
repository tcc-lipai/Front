import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import Botao from "../Botao";
import { buscarDicaFonema } from "../../services/falaService";
import "./index.css";

/**
 * Mostrado antes da primeira atividade de uma unidade: busca a dica
 * articulatória do fonema (RAG) e só deixa continuar depois de ler.
 */
const DicaFonemaModal = ({ fonema, onContinuar, onFechar }) => {
  const [carregando, setCarregando] = useState(true);
  const [dica, setDica] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!fonema) return;
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      const res = await buscarDicaFonema(fonema);
      if (!ativo) return;
      if (res.sucesso) {
        setDica(res.data?.dica ?? res.data?.Dica ?? "");
      } else {
        setErro(res.mensagem);
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [fonema]);

  if (!fonema) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-container dica-fonema-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onFechar} aria-label="Fechar">
          &times;
        </button>

        <div className="dica-fonema-modal__icone">
          <Lightbulb size={28} />
        </div>

        <h2 className="modal-title">Antes de começar: dica do fonema {fonema}</h2>
        <p className="dica-fonema-modal__subtitulo">
          Essa é a primeira vez que você pratica essa unidade. Dá uma lida nessa dica rapidinho
          antes de ir pra atividade.
        </p>

        {carregando && <p className="dica-fonema-modal__texto">Carregando dica...</p>}
        {!carregando && erro && <p className="dica-fonema-modal__texto">{erro}</p>}
        {!carregando && !erro && (
          <div className="dica-fonema-modal__texto">
            {dica.split("\n\n").map((paragrafo, indice) => (
              <p key={indice}>{paragrafo}</p>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <Botao texto="Pular" variante="secundario" onClick={onFechar} />
          <Botao
            texto="Entendi, começar atividade"
            onClick={() => {
              onContinuar();
              onFechar();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DicaFonemaModal;
