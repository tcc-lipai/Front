import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext";

const STORAGE_KEY = "lipai-theme";

function prefereEscuroNoSistema() {
  return (
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

function obterTemaInicial() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo === "dark" || salvo === "light") {
    return salvo;
  }
  return prefereEscuroNoSistema() ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(obterTemaInicial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode: theme === "dark",
      setTheme,
      toggleTheme: () => setTheme((atual) => (atual === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
