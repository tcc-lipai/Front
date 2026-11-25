import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext";

// chave nova: a antiga guardava sozinha o tema do sistema (escuro) mesmo sem a pessoa escolher
const STORAGE_KEY = "lipai-tema";

function obterTemaInicial() {
  // claro é o padrão; só fica escuro se a pessoa tiver escolhido
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
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
