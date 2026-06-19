import "./index.css";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/Botao";

const TelaLoginUser = () => {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <div className="bg-triangle triangle-1"></div>
      <div className="bg-triangle triangle-2"></div>
      <div className="bg-triangle triangle-3"></div>

      <div className="login-container">
        {/* LADO ESQUERDO */}
        <div className="login-left">
          <h1>Entrar sua conta!</h1>

          <p className="subtitle">Preencha seus dados para entrar</p>

          <div className="input-group">
            <input type="email" placeholder="Email" />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Senha" />
          </div>

          <div className="btn-container">
            <Botao texto="Entrar" corDeFundo="#8426ac" corBorda=""/>
          </div>

          <div className="google-login">
            <span>Entre com google:</span>

            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
            />
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="login-right">
          <div className="welcome-content">
            <h2>Olá de novo!</h2>

            <p>
              Não possui uma conta?
              <br />
              Por favor, preencha suas informações aqui
            </p>

            <Botao texto="Cadastro" corDeFundo="transparent" corBorda="white" onClick={() => navigate("/criar-conta")}/>

            <div className="triangle-top"></div>
            <div className="triangle-middle"></div>
            <div className="triangle-small-bottom"></div>
            <div className="triangle-large-left"></div>
            <div className="triangle-top-left"></div>
          </div>

          <div className="shape triangle-top"></div>
          <div className="shape triangle-middle"></div>
        </div>
      </div>
    </div>
  );
};

export default TelaLoginUser;
