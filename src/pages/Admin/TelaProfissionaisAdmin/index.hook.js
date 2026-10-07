import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarProfissionais,
  excluirProfissional,
  buscarProfissional,
} from "../../../services/profissionalService";
import { nomeNivelDificuldade } from "../../../services/usuarioService";

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

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    const res = await listarProfissionais();
    if (!res.sucesso) {
      setErro(res.mensagem);
      setCarregando(false);
      return;
    }
    setProfissionais(res.data.map(mapearProfissional));
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const confirmarExclusao = useCallback(async () => {
    if (!profissionalParaExcluir) return;
    const res = await excluirProfissional(profissionalParaExcluir.id);
    if (!res.sucesso) {
      setErro(res.mensagem);
    } else {
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
    abrirCadastro: () => navigate("/cadastrar-profissional"),
    abrirEdicao: (profissional) => navigate(`/editar-profissional/${profissional.id}`),
  };
}
