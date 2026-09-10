import { useMemo, useState } from "react";

const NIVEIS = [
  { valor: "", rotulo: "Todos" },
  { valor: "Iniciante", rotulo: "Iniciante" },
  { valor: "Intermediário", rotulo: "Intermediário" },
  { valor: "Avançado", rotulo: "Avançado" },
];

const CONSISTENCIAS = [
  { valor: "", rotulo: "Todos" },
  { valor: "ativo", rotulo: "Ativo" },
  { valor: "inativo", rotulo: "Inativo" },
];

export function usePainelListaUsuarios(usuarios) {
  const [pesquisa, setPesquisa] = useState("");
  const [nivel, setNivel] = useState("");
  const [consistencia, setConsistencia] = useState("");

  const usuariosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    return usuarios.filter((usuario) => {
      const batePesquisa = usuario.nome.toLowerCase().includes(termo);
      const bateNivel = !nivel || usuario.nivel === nivel;
      const bateConsistencia = !consistencia || usuario.status === consistencia;
      return batePesquisa && bateNivel && bateConsistencia;
    });
  }, [usuarios, pesquisa, nivel, consistencia]);

  return {
    pesquisa,
    setPesquisa,
    nivel,
    setNivel,
    consistencia,
    setConsistencia,
    usuariosFiltrados,
    NIVEIS,
    CONSISTENCIAS,
  };
}
