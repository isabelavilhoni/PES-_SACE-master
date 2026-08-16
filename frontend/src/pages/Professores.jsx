import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function Professores() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const formatarCPF = (valor) => {
    if (!valor) return "";
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    return numeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    return numeros
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  useEffect(() => {
    if (isEditing) {
      api
        .get(`/professores/${id}`)
        .then((response) => {
          setNome(response.data.nome_completo || "");
          setCpf(formatarCPF(response.data.cpf) || "");
          setLogin(response.data.login || "");
          setEmail(response.data.email || "");
          setTelefone(formatarTelefone(response.data.telefone || ""));
        })
        .catch((error) => {
          console.error("Erro ao buscar professor:", error);
          alert("Erro ao carregar os dados do professor.");
        });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      !nome ||
      !cpf ||
      !login ||
      !email ||
      !telefone ||
      (!isEditing && !senha)
    ) {
      return alert("Por favor, preencha todos os campos obrigatórios!");
    }

    setIsSubmitting(true);

    try {
      const dados = {
        nome_completo: nome.trim(),
        cpf: cpf.replace(/\D/g, ""),
        login: login.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        telefone: telefone.replace(/\D/g, ""),
        perfil: "Professor",
      };

      if (senha) dados.senha = senha;

      if (isEditing) {
        await api.put(`/professores/${id}`, dados);
        alert("Professor atualizado com sucesso!");
      } else {
        await api.post("/professores", dados);
        alert("Professor cadastrado com sucesso!");
      }
      navigate("/professores");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.message || "Erro ao salvar os dados.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        className="filter-title"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "3px" }}>
            {isEditing ? "Editar Professor" : "Novo Professor"}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Preencha os dados do professor e as informações de acesso.
          </p>
        </div>
      </div>

      <div className="content-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "35px", color: "#04225c" }}
          >
            co_present
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Dados do Professor
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                Nome Completo <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                required
              />
            </div>
            <div className="form-group">
              <label>
                CPF <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                E-mail <span className="required-star">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>
                Telefone <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "30px",
              marginTop: "40px",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "35px", color: "#04225c" }}
            >
              lock
            </span>
            <span
              style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}
            >
              Acesso ao Sistema
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Usuário/Login<span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Ex: exemplo_nome"
                required
              />
            </div>
            {!isEditing && (
              <div className="form-group">
                <label>
                  Senha <span className="required-star">*</span>
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <hr className="form-divider" />

          <div className="btn-group" style={{ marginTop: "30px" }}>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditing
                ? "Salvar Alterações"
                : "Salvar Professor"}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/professores")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Professores;
