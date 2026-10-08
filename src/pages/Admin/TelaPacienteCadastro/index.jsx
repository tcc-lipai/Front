import Navbar from "../../../components/NavbarVoltar";
import Botao from "../../../components/Botao";
import { NIVEIS_DIFICULDADE } from "../../../services/usuarioService";
import { useTelaPacienteCadastro } from "./index.hook";
import "./index.css";

const CadastrarPaciente = () => {
  const { modoEdicao, form, carregando, enviando, erro, handleChange, handleSubmit } =
    useTelaPacienteCadastro();

  return (
    <div className="cadastro-page-container">
      <Navbar destino="/dashboard-admin" />

      <main className="cadastro-main-content">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <h1 className="cadastro-title">{modoEdicao ? "Editar Paciente" : "Cadastrar Paciente"}</h1>
          </div>

          {carregando ? (
            <p className="cadastro-carregando">Carregando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="form-group">
                <label htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder={modoEdicao ? "Deixe em branco para manter a atual" : ""}
                  value={form.senha}
                  onChange={handleChange}
                  required={!modoEdicao}
                />
              </div>

              <div className="form-group">
                <label htmlFor="nivelDificuldade">Nível de dificuldade:</label>
                <select
                  id="nivelDificuldade"
                  name="nivelDificuldade"
                  value={form.nivelDificuldade}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Nível dificuldade
                  </option>
                  {NIVEIS_DIFICULDADE.map((n) => (
                    <option key={n.valor} value={n.valor}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="diagnostico">Diagnóstico:</label>
                <input
                  type="text"
                  id="diagnostico"
                  name="diagnostico"
                  value={form.diagnostico}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group input-opcional">
                <label htmlFor="codigoProfissional">Código do profissional:</label>
                <input
                  type="text"
                  id="codigoProfissional"
                  name="codigoProfissional"
                  value={form.codigoProfissional}
                  onChange={handleChange}
                />
                <span className="label-opcional">*Opcional</span>
              </div>

              {erro && <span className="cadastro-erro">{erro}</span>}

              <div className="container-botao-enviar">
                <Botao
                  texto={enviando ? "Salvando..." : modoEdicao ? "Salvar" : "Cadastrar"}
                  type="submit"
                  className="btn-cadastro-submit"
                  disabled={enviando}
                />
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CadastrarPaciente;
