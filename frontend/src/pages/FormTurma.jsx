import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const FormTurma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nome_turma: "",
    ano_letivo: "2026",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const carregarTurma = async () => {
        try {
          const response = await api.get(`/turmas/${id}`);
          setFormData({
            nome_turma: response.data.nome_turma || "",
            ano_letivo: response.data.ano_letivo || "2026",
          });
        } catch (error) {
          console.error(error);
          alert("Erro ao carregar dados da turma.");
        }
      };
      carregarTurma();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.nome_turma || !formData.ano_letivo) {
      return alert("Por favor, preencha todos os campos obrigatórios!");
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/turmas/${id}`, formData);
        alert("Turma atualizada com sucesso!");
      } else {
        await api.post("/turmas", formData);
        alert("Turma cadastrada com sucesso!");
      }
      navigate("/turmas");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar turma.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER PADRONIZADO */}
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
            {isEditing ? "Editar Turma" : "Nova Turma"}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Preencha os dados da turma e defina o ano letivo correspondente.
          </p>
        </div>
      </div>

      {/* CARD CENTRAL */}
      <div className="content-card">
        {/* SUBTÍTULO INTERNO COM ÍCONE DE GRUPOS/TURMAS */}
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
            class
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Dados da Turma
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* GRID DE CAMPOS DO SEU LAYOUT GLOBAL */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>
                Nome da Turma <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={formData.nome_turma}
                onChange={(e) =>
                  setFormData({ ...formData, nome_turma: e.target.value })
                }
                placeholder="Ex: 5º Ano..."
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Ano Letivo <span className="required-star">*</span>
              </label>
              <input
                type="number"
                value={formData.ano_letivo}
                onChange={(e) =>
                  setFormData({ ...formData, ano_letivo: e.target.value })
                }
                placeholder="Ex: 2026"
                required
              />
            </div>
          </div>

          {/* DIVISOR DE SEÇÃO */}
          <hr
            className="form-divider"
            style={{ marginTop: "40px", marginBottom: "30px" }}
          />

          {/* GRUPO DE BOTÕES PADRÃO DO SEU FORMULÁRIO */}
          <div className="btn-group">
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditing
                ? "Salvar Alterações"
                : "Salvar Turma"}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/turmas")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormTurma;
