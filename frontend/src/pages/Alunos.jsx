import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Alunos = () => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [matricula, setMatricula] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  // =========================================
  // BUSCAR DADOS
  // =========================================
  useEffect(() => {
    if (isEditing) {
      buscarAluno();
    }
  }, [id]);

  const buscarAluno = async () => {
    try {
      const response = await api.get(`/alunos/${id}`);
      const aluno = response.data;

      setNomeCompleto(aluno.nome_completo || "");
      setMatricula(aluno.matricula || "");
      setCpf(aluno.cpf || "");

      setDataNascimento(
        aluno.data_nascimento ? aluno.data_nascimento.slice(0, 10) : ""
      );

      setTelefoneResponsavel(aluno.telefone || "");
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
      alert("Erro ao carregar os dados do aluno.");
    }
  };

  // =========================================
  // FORMATAR TELEFONE
  // =========================================
  const formatarTelefone = (valor) => {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 11);
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    return valor;
  };

  // =========================================
  // FORMATAR CPF
  // =========================================
  const handleCpfChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
  };

  // =========================================
  // SALVAR
  // =========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const dadosAluno = {
        matricula,
        nome_completo: nomeCompleto,
        data_nascimento: dataNascimento,
        cpf,
        telefone: telefoneResponsavel,
      };

      if (isEditing) {
        await api.put(`/alunos/${id}`, dadosAluno);
        alert("Aluno atualizado com sucesso!");
      } else {
        await api.post("/alunos", dadosAluno);
        alert("Aluno cadastrado com sucesso!");
      }

      navigate("/alunos");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao salvar os dados."
      );
    } finally {
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
            {isEditing ? "Editar Aluno" : "Novo Aluno"}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            {isEditing
              ? "Atualize as informações do aluno."
              : "Realize o cadastro do aluno."}
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
            group
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Dados Pessoais
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* NOME E MATRÍCULA */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>
                Nome completo <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Nome do aluno..."
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Matrícula <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ex: 2024001"
                required
              />
            </div>
          </div>

          {/* CPF / NASCIMENTO / TELEFONE */}
          <div className="form-row" style={{ marginBottom: "20px" }}>
            <div className="form-group">
              <label>
                CPF <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="form-group">
              <label>
                Data de Nascimento <span className="required-star">*</span>
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Telefone do Responsável <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={telefoneResponsavel}
                onChange={(e) =>
                  setTelefoneResponsavel(formatarTelefone(e.target.value))
                }
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          <hr className="form-divider" style={{ marginBottom: "30px" }} />

          {/* BOTÕES */}
          <div className="btn-group">
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditing
                ? "Salvar Alterações"
                : "Salvar Cadastro"}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/alunos")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Alunos;
