import Navbar from "../../../components/NavbarVoltar";
import Botao from "../../../components/Botao";
import { useTelaProfissionalCadastro } from "./index.hook";
import "../TelaPacienteCadastro/index.css";

const TelaProfissionalCadastro = () => {
  const { modoEdicao, form, carregando, enviando, erro, handleChange, handleSubmit } =
    useTelaProfissionalCadastro();

  return (
    <div className="cadastro-page-container">
      <Navbar destino="/profissional-admin" />

      <main className="cadastro-main-content">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <h1 className="cadastro-title">
              {modoEdicao ? "Editar Profissional" : "Cadastrar Profissional"}
            </h1>
          </div>

          {carregando ? (
            <p className="cadastro-carregando">Carregando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="form-group">
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder={modoEdicao ? "Deixe em branco para manter a atual" : "Mínimo de 6 caracteres"}
                  value={form.senha}
                  onChange={handleChange}
                  required={!modoEdicao}
                />
              </div>

              <div className="form-group input-opcional">
                <label htmlFor="registro">Registro profissional:</label>
                <input type="text" id="registro" name="registro" value={form.registro} onChange={handleChange} />
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

export default TelaProfissionalCadastro;
