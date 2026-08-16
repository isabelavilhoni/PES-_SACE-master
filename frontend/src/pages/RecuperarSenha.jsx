import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function RecuperarSenha() {
  const [login, setLogin] = useState("");
  const [cpf, setCpf] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ texto: "", tipo: "" });
  const navigate = useNavigate();

  const formatarCPF = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ texto: "", tipo: "" }); // Limpa mensagem anterior

    try {
      // Envia o CPF limpo (apenas números) para o backend
      await api.post("/auth/recuperar-senha", {
        login,
        cpf: cpf.replace(/\D/g, ""),
        novaSenha,
      });

      setStatus({ texto: "Senha redefinida com sucesso!", tipo: "success" });

      // Aguarda 2 segundos para o usuário ler a mensagem antes de redirecionar
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setStatus({
        texto: error.response?.data?.message || "Erro ao redefinir senha.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <h2 className="login-logo-title">SACE</h2>
          <p className="login-logo-subtitle">Recuperação de Senha</p>
        </div>

        {/* Exibição das mensagens de feedback */}
        {status.texto && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              backgroundColor:
                status.tipo === "success" ? "#d4edda" : "#f8d7da",
              color: status.tipo === "success" ? "#155724" : "#721c24",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {status.texto}
          </div>
        )}

        <form onSubmit={handleRecuperar} className="login-form">
          <div className="form-group">
            <label>Login</label>
            <input
              type="text"
              placeholder="Digite seu login..."
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              maxLength="14"
              required
            />
          </div>

          <div className="form-group">
            <label>Nova Senha</label>
            <input
              type="password"
              placeholder="Digite a nova senha..."
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Processando..." : "Confirmar Alteração"}
          </button>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Link to="/" style={{ color: "#737373", fontSize: "14px" }}>
              Voltar para o Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenha;
