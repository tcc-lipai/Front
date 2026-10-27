import { useEffect, useMemo, useState } from "react";
import { AcessibilidadeContext } from "./themeContext";
import { NIVEIS_FONTE } from "./index.types";

const CHAVE_FONTE = "lipai-acessibilidade-fonte";
const CHAVE_CONTRASTE = "lipai-acessibilidade-contraste";

function obterFonteInicial() {
  const salvo = localStorage.getItem(CHAVE_FONTE);
  return NIVEIS_FONTE.includes(salvo) ? salvo : "normal";
}

function obterContrasteInicial() {
  return localStorage.getItem(CHAVE_CONTRASTE) === "true";
}

export function AcessibilidadeProvider({ children }) {
  const [tamanhoTexto, setTamanhoTexto] = useState(obterFonteInicial);
  const [altoContraste, setAltoContraste] = useState(obterContrasteInicial);

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
      resetarAcessibilidade: () => {
        setTamanhoTexto("normal");
        setAltoContraste(false);
      },
    };
  }, [tamanhoTexto, altoContraste]);

  return (
    <AcessibilidadeContext.Provider value={value}>{children}</AcessibilidadeContext.Provider>
  );
}

export default AcessibilidadeProvider;
