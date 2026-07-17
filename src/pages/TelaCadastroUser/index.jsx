import "./index.css";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/Botao";

const TelaCadastroUser = () => {
  const navigate = useNavigate();

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
          <p className="subtitle">
            Preencha seus dados para se registrar
          </p>

          <div className="form-scroll">
            <div className="input-group">
              <input type="text" placeholder="Nome" />
            </div>

            <div className="input-group">
              <input type="email" placeholder="Email" />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Senha" />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Confirme sua senha" />
            </div>

            <div className="divider"></div>

            <div className="input-group">
              <select>
                <option>Nível de dificuldade</option>
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
            </div>

            <div className="input-group">
              <input type="text" placeholder="Código do profissional" />
            </div>

            <span className="helper-text">
              Este campo só deve ser preenchido se sua conta for vinculada a um profissional da saúde.
            </span>

            <div className="btn-container">
              <Botao texto="Cadastrar-se" corDeFundo="#8426ac" corBorda=""/>
            </div>

            <div className="google-login">
              <span>Crie uma conta com:</span>

              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelaCadastroUser;