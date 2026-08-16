import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. Adicionei o Link aqui
import api from "../services/api";

const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (!login || !senha) {
      setErro("Por favor, preencha o usuário e a senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", { login, senha });
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      navigate("/inicio");
    } catch (error) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message);
      } else {
        setErro("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <h2 className="login-logo-title">SACE</h2>
          <p className="login-logo-subtitle">Acesso ao Sistema</p>
        </div>

        {erro && <div className="error-box">{erro}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Digite seu login..."
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha..."
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* 2. Link adicionado aqui */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Link
              to="/recuperar-senha"
              style={{
                color: "#04225c",
                fontSize: "14px",
                textDecoration: "underline",
              }}
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
