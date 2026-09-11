import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/Botao";
import { cadastrarUsuario } from "../../services/usuarioService";
import { login } from "../../services/authService";

// Precisa bater com o enum NivelDificuldade do back-end.
const NIVEIS = [
  { valor: 1, label: "Iniciante" },
  { valor: 2, label: "Básico" },
  { valor: 3, label: "Intermediário" },
  { valor: 4, label: "Avançado" },
];

const TelaCadastroUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    nivelDificuldade: "",
    codigoProfissional: "",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!form.nivelDificuldade) {
      setErro("Selecione o nível de dificuldade.");
      return;
    }

    const payload = {
      Nome: form.nome,
      Email: form.email,
      Senha: form.senha,
      NivelDificuldade: Number(form.nivelDificuldade),
      Diagnostico: "", // ajuste se tiver um campo pra isso no form
      CodigoProfissional: form.codigoProfissional || null,
    };

    setCarregando(true);
    const resultado = await cadastrarUsuario(payload);

    if (!resultado.sucesso) {
      setCarregando(false);
      setErro(resultado.mensagem);
      return;
    }

    // conta criada; entra automaticamente com as credenciais informadas
    const loginResultado = await login(form.email, form.senha);
    setCarregando(false);

    if (loginResultado.sucesso) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="cadastro-page">
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <div className="bg-triangle triangle-1"></div>
      <div className="bg-triangle triangle-2"></div>
      <div className="bg-triangle triangle-3"></div>

      <div className="cadastro-container">
        <div className="cadastro-left">
          <div className="welcome-content">
            <h2>Seja Bem vindo</h2>

            <p>
              Se já possui uma conta?
              <br />
              Por favor, preencha suas informações aqui
            </p>

            <Botao
              texto="Login"
              corDeFundo="transparent"
              corBorda="white"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>

        <div className="cadastro-right">
          <h1>Crie sua conta!</h1>
          <p className="subtitle">Preencha seus dados para se registrar</p>

          <form className="form-scroll" onSubmit={handleCadastro}>
            <div className="input-group">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Confirme sua senha"
                value={form.confirmarSenha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="divider"></div>

            <div className="input-group">
              <select
                name="nivelDificuldade"
                value={form.nivelDificuldade}
                onChange={handleChange}
                required
              >
                <option value="">Nível de dificuldade</option>
                {NIVEIS.map((n) => (
                  <option key={n.valor} value={n.valor}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="codigoProfissional"
                placeholder="Código do profissional"
                value={form.codigoProfissional}
                onChange={handleChange}
              />
            </div>

            <span className="helper-text">
              Este campo só deve ser preenchido se sua conta for vinculada a um profissional da
              saúde.
            </span>

            {erro && (
              <span className="helper-text" style={{ color: "#c0392b" }}>
                {erro}
              </span>
            )}

            <div className="btn-container">
              <Botao
                texto={carregando ? "Cadastrando..." : "Cadastrar-se"}
                corDeFundo="#8426ac"
                corBorda=""
                onClick={handleCadastro}
              />
            </div>

            <div className="google-login">
              <span>Crie uma conta com:</span>

              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TelaCadastroUser;
