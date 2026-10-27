import { useEffect, useMemo, useState } from "react";
import { AcessibilidadeContext } from "./themeContext";
import { NIVEIS_FONTE, TOGGLES_ACESSIBILIDADE } from "./index.types";

const CHAVE_FONTE = "lipai-acessibilidade-fonte";
const CHAVE_CONTRASTE = "lipai-acessibilidade-contraste";
const PREFIXO_CHAVE_TOGGLE = "lipai-acessibilidade-";

function obterFonteInicial() {
  const salvo = localStorage.getItem(CHAVE_FONTE);
  return NIVEIS_FONTE.includes(salvo) ? salvo : "normal";
}

function obterContrasteInicial() {
  return localStorage.getItem(CHAVE_CONTRASTE) === "true";
}

function obterTogglesIniciais() {
  const estado = {};
  for (const { chave } of TOGGLES_ACESSIBILIDADE) {
    estado[chave] = localStorage.getItem(PREFIXO_CHAVE_TOGGLE + chave) === "true";
  }
  return estado;
}

// lê em voz alta o texto do elemento clicado (modo "Ler texto em voz alta")
function lerEmVozAlta(evento) {
  const alvo = evento.target;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName)) return;

  const texto = (alvo.innerText ?? alvo.textContent ?? "").trim();
  if (!texto || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  window.speechSynthesis.speak(fala);
}

export function AcessibilidadeProvider({ children }) {
  const [tamanhoTexto, setTamanhoTexto] = useState(obterFonteInicial);
  const [altoContraste, setAltoContraste] = useState(obterContrasteInicial);
  const [toggles, setToggles] = useState(obterTogglesIniciais);

  useEffect(() => {
    if (tamanhoTexto === "normal") {
      delete document.documentElement.dataset.fonte;
    } else {
      document.documentElement.dataset.fonte = tamanhoTexto;
    }
    localStorage.setItem(CHAVE_FONTE, tamanhoTexto);
  }, [tamanhoTexto]);

  useEffect(() => {
    if (altoContraste) {
      document.documentElement.dataset.contraste = "alto";
    } else {
      delete document.documentElement.dataset.contraste;
    }
    localStorage.setItem(CHAVE_CONTRASTE, String(altoContraste));
  }, [altoContraste]);

  useEffect(() => {
    for (const { chave } of TOGGLES_ACESSIBILIDADE) {
      if (toggles[chave]) {
        document.documentElement.dataset[chave] = "true";
      } else {
        delete document.documentElement.dataset[chave];
      }
      localStorage.setItem(PREFIXO_CHAVE_TOGGLE + chave, String(Boolean(toggles[chave])));
    }
  }, [toggles]);

  useEffect(() => {
    if (!toggles.leituraVoz) return undefined;
    document.addEventListener("click", lerEmVozAlta);
    return () => document.removeEventListener("click", lerEmVozAlta);
  }, [toggles.leituraVoz]);

  const value = useMemo(() => {
    const indice = NIVEIS_FONTE.indexOf(tamanhoTexto);

    return {
      tamanhoTexto,
      setTamanhoTexto,
      podeAumentar: indice < NIVEIS_FONTE.length - 1,
      podeDiminuir: indice > 0,
      aumentarTexto: () => setTamanhoTexto(NIVEIS_FONTE[Math.min(indice + 1, NIVEIS_FONTE.length - 1)]),
      diminuirTexto: () => setTamanhoTexto(NIVEIS_FONTE[Math.max(indice - 1, 0)]),

      altoContraste,
      toggleAltoContraste: () => setAltoContraste((atual) => !atual),

      toggles,
      toggleFlag: (chave) => setToggles((atual) => ({ ...atual, [chave]: !atual[chave] })),

      resetarAcessibilidade: () => {
        setTamanhoTexto("normal");
        setAltoContraste(false);
        setToggles(() => {
          const zerado = {};
          for (const { chave } of TOGGLES_ACESSIBILIDADE) zerado[chave] = false;
          return zerado;
        });
      },
    };
  }, [tamanhoTexto, altoContraste, toggles]);

  return (
    <AcessibilidadeContext.Provider value={value}>{children}</AcessibilidadeContext.Provider>
  );
}

export default AcessibilidadeProvider;
