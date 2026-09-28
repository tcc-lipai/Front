import { useEffect, useMemo, useState } from "react";

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

const PAGINA_TAMANHO = 6;

export function usePainelListaUsuarios(usuarios) {
  const [pesquisa, setPesquisa] = useState("");
  const [nivel, setNivel] = useState("");
  const [consistencia, setConsistencia] = useState("");
  const [visiveis, setVisiveis] = useState(PAGINA_TAMANHO);

  const usuariosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    return usuarios.filter((usuario) => {
      const batePesquisa = usuario.nome.toLowerCase().includes(termo);
      const bateNivel = !nivel || usuario.nivel === nivel;
      const bateConsistencia = !consistencia || usuario.status === consistencia;
      return batePesquisa && bateNivel && bateConsistencia;
    });
  }, [usuarios, pesquisa, nivel, consistencia]);

  // volta pra primeira leva sempre que o filtro muda, senão "Ver mais" já
  // começaria expandido pra um resultado novo e menor
  useEffect(() => {
    setVisiveis(PAGINA_TAMANHO);
  }, [pesquisa, nivel, consistencia]);

  const usuariosVisiveis = usuariosFiltrados.slice(0, visiveis);
  const temMais = visiveis < usuariosFiltrados.length;
  const verMais = () => setVisiveis((v) => v + PAGINA_TAMANHO);

  return {
    pesquisa,
    setPesquisa,
    nivel,
    setNivel,
    consistencia,
    setConsistencia,
    usuariosFiltrados: usuariosVisiveis,
    temMais,
    verMais,
    NIVEIS,
    CONSISTENCIAS,
  };
}
