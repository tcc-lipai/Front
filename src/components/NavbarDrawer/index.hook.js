// index.hook.js
// Pequena melhoria de UX: fecha o drawer ao apertar Esc, enquanto ele
// estiver aberto.

import { useEffect } from "react";

export function useNavbarDrawer(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
}