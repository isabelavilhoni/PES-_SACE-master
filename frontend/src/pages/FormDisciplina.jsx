import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const FormDisciplina = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      api
        .get(`/disciplinas/${id}`)
        .then((res) => {
          // Impede edição de disciplina inativa
          if (res.data.ativo === 0) {
            alert("Disciplina inativa não pode ser editada.");
            navigate("/disciplinas");
            return;
          }

          setNome(res.data.nome || "");
          setCargaHoraria(res.data.carga_horaria || "");
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao carregar os dados da disciplina.");
          navigate("/disciplinas");
        });
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const cargaNumerica = parseInt(cargaHoraria, 10);

    if (!nome.trim() || !cargaHoraria) {
      return alert("Por favor, preencha todos os campos obrigatórios!");
    }

    if (isNaN(cargaNumerica) || cargaNumerica <= 0) {
      return alert("A carga horária deve ser um número maior que zero.");
    }

    setIsSubmitting(true);

    const dados = {
      nome: nome.trim(),
      carga_horaria: cargaNumerica,
    };

    try {
      if (isEditing) {
        // Segurança extra
        const disciplina = await api.get(`/disciplinas/${id}`);

        if (disciplina.data.ativo === 0) {
          alert("Disciplina inativa não pode ser editada.");
          navigate("/disciplinas");
          return;
        }

        await api.put(`/disciplinas/${id}`, dados);
        alert("Disciplina atualizada com sucesso!");
      } else {
        await api.post("/disciplinas", dados);
        alert("Disciplina cadastrada com sucesso!");
      }

      navigate("/disciplinas");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao salvar disciplina.");
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
            {isEditing ? "Editar Disciplina" : "Nova Disciplina"}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Preencha os dados da disciplina e a carga horária correspondente.
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
            menu_book
          </span>

          <span
            style={{
              fontWeight: "900",
              fontSize: "22px",
              color: "#333",
            }}
          >
            Dados da Disciplina
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>
                Nome da Disciplina <span className="required-star">*</span>
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Matemática, Português..."
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Carga Horária (horas) <span className="required-star">*</span>
              </label>

              <input
                type="number"
                min="1"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(e.target.value)}
                placeholder="Ex: 80"
                required
              />
            </div>
          </div>

          <hr
            className="form-divider"
            style={{
              marginTop: "40px",
              marginBottom: "30px",
            }}
          />

          <div className="btn-group">
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditing
                ? "Salvar Alterações"
                : "Salvar Disciplina"}
            </button>

            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/disciplinas")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDisciplina;
