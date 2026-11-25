import { useEffect, useMemo, useState } from "react";
import { listarCategorias, listarPalavras } from "../../services/dicionarioService";
import { getCached, setCached } from "../../utils/apiCache";

const CHAVE_CACHE = "dicionario";

export function useTelaDicionario() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [palavras, setPalavras] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [palavraAberta, setPalavraAberta] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const emCache = getCached(CHAVE_CACHE);
      const [categoriasRes, palavrasRes] = emCache ?? (await Promise.all([
        listarCategorias(),
        listarPalavras(),
      ]));
      if (!ativo) return;
      if (!emCache) setCached(CHAVE_CACHE, [categoriasRes, palavrasRes]);

      const palavrasComVideo = palavrasRes.sucesso
        ? palavrasRes.data.filter((p) => p.videoUrl ?? p.VideoUrl)
        : [];

      if (categoriasRes.sucesso) {
        const idsComVideo = new Set(
          palavrasComVideo.map((p) => p.categoriaId ?? p.CategoriaId)
        );
        const categoriasComVideo = categoriasRes.data.filter((c) =>
          idsComVideo.has(c.idCategoria ?? c.IdCategoria)
        );
        setCategorias(categoriasComVideo);
        const primeira = categoriasComVideo[0];
        if (primeira) {
          setCategoriaAtiva(primeira.idCategoria ?? primeira.IdCategoria);
        }
      } else {
        setErro(categoriasRes.mensagem);
      }

      if (palavrasRes.sucesso) setPalavras(palavrasRes.data);

      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);
  const abrirPalavra = (palavra) => setPalavraAberta(palavra);
  const fecharPalavra = () => setPalavraAberta(null);

  const cardsFiltrados = useMemo(() => {
    const comVideo = palavras.filter((palavra) => palavra.videoUrl ?? palavra.VideoUrl);
    if (categoriaAtiva == null) return comVideo;
    return comVideo.filter(
      (palavra) => (palavra.categoriaId ?? palavra.CategoriaId) === categoriaAtiva
    );
  }, [palavras, categoriaAtiva]);

  return {
    carregando,
    erro,
    categorias,
    categoriaAtiva,
    setCategoriaAtiva,
    cardsFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    palavraAberta,
    abrirPalavra,
    fecharPalavra,
  };
}
