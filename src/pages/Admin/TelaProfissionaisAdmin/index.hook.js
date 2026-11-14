import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarProfissionais,
  excluirProfissional,
  buscarProfissional,
} from "../../../services/profissionalService";
import { nomeNivelDificuldade } from "../../../services/usuarioService";
import { getCached, setCached, invalidateCached } from "../../../utils/apiCache";

const CHAVE_CACHE = "admin-profissionais";

function mapearProfissional(profissional) {
  const qtde = profissional.qtdePacientes ?? profissional.QtdePacientes ?? 0;
  const codigo = profissional.codigoAcesso ?? profissional.CodigoAcesso ?? "";
  return {
    id: profissional.idProfissional ?? profissional.IdProfissional,
    nome: profissional.nome ?? profissional.Nome,
    descricao: `Código: ${codigo} · ${qtde} paciente(s)`,
    nivel: "",
    status: "ativo",
  };
}

export function useTelaProfissionaisAdmin() {
  const navigate = useNavigate();

  const [profissionais, setProfissionais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [profissionalParaExcluir, setProfissionalParaExcluir] = useState(null);

  useEffect(() => {
    let ativo = true;

    (async () => {
      const res = getCached(CHAVE_CACHE) ?? (await listarProfissionais());
      if (!ativo) return;
      setCached(CHAVE_CACHE, res);
      if (!res.sucesso) {
        setErro(res.mensagem);
        setCarregando(false);
        return;
      }
      setProfissionais(res.data.map(mapearProfissional));
      setCarregando(false);
    })();

    return () => {
      ativo = false;
    };
  }, []);

  const confirmarExclusao = useCallback(async () => {
    if (!profissionalParaExcluir) return;
    const res = await excluirProfissional(profissionalParaExcluir.id);
    if (!res.sucesso) {
      setErro(res.mensagem);
    } else {
      invalidateCached(CHAVE_CACHE);
      setProfissionais((atual) => atual.filter((p) => p.id !== profissionalParaExcluir.id));
    }
    setProfissionalParaExcluir(null);
  }, [profissionalParaExcluir]);

  const [vinculados, setVinculados] = useState(null);
  const [carregandoVinculados, setCarregandoVinculados] = useState(false);

  const verPacientes = useCallback(async (profissional) => {
    setVinculados({ nome: profissional.nome, pacientes: [] });
    setCarregandoVinculados(true);
    const res = await buscarProfissional(profissional.id);
    setCarregandoVinculados(false);
    if (!res.sucesso) {
      setVinculados({ nome: profissional.nome, pacientes: [], erro: res.mensagem });
      return;
    }
    const lista = res.data.pacientes ?? res.data.Pacientes ?? [];
    setVinculados({
      nome: profissional.nome,
      pacientes: lista.map((p) => ({
        id: p.idUsuario ?? p.IdUsuario,
        nome: p.nome ?? p.Nome,
        email: p.email ?? p.Email,
        nivel: nomeNivelDificuldade(p.nivelDificuldade ?? p.NivelDificuldade),
      })),
    });
  }, []);

  return {
    profissionais,
    carregando,
    erro,
    vinculados,
    carregandoVinculados,
    fecharVinculados: () => setVinculados(null),
    verPacientes,
    profissionalParaExcluir,
    setProfissionalParaExcluir,
    cancelarExclusao: () => setProfissionalParaExcluir(null),
    confirmarExclusao,
    abrirCadastro: () => {
      invalidateCached(CHAVE_CACHE);
      navigate("/cadastrar-profissional");
    },
    abrirEdicao: (profissional) => {
      invalidateCached(CHAVE_CACHE);
      navigate(`/editar-profissional/${profissional.id}`);
    },
  };
}
