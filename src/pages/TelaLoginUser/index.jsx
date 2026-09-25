import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/Botao";
import { login } from "../../services/authService";

const TelaLoginUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (!form.email || !form.senha) {
      setErro("Preencha o email e a senha para entrar.");
      return;
    }

    setCarregando(true);

    const resultado = await login(form.email, form.senha);
    setCarregando(false);

    if (resultado.sucesso) {
      navigate("/dashboard");
    } else {
      setErro(resultado.mensagem);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <div className="bg-triangle triangle-1"></div>
      <div className="bg-triangle triangle-2"></div>
      <div className="bg-triangle triangle-3"></div>

      <div className="login-container">
        <div className="login-left">
          <h1>Entrar sua conta!</h1>
          <p className="subtitle">Preencha seus dados para entrar</p>

          <form className="form-scroll" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
              />
            </div>

            {erro && (
              <span className="helper-text" style={{ color: "#c0392b" }}>
                {erro}
              </span>
            )}

            <div className="btn-container">
              <Botao texto={carregando ? "Entrando..." : "Entrar"} onClick={handleLogin} />
            </div>
          </form>
        </div>

        <div className="login-right">
          <div className="welcome-content">
            <h2>Olá de novo!</h2>
            <p>
              Não possui uma conta?
              <br />
              Por favor, preencha suas informações aqui
            </p>
            <Botao
              texto="Cadastro"
              corDeFundo="transparent"
              corTexto="white"
              corBorda="white"
              onClick={() => navigate("/criar-conta")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelaLoginUser;
