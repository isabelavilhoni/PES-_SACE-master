import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const GradeTurma = () => {
  const { id } = useParams();

  const [turma, setTurma] = useState({});
  const [alocacoes, setAlocacoes] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [formData, setFormData] = useState({
    id_professor: "",
    id_disciplina: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line
  }, [id]);

  const carregarDados = async () => {
    try {
      const resTurma = await api.get(`/turmas/${id}`);
      setTurma(resTurma.data);

      const resAux = await api.get("/alocacoes/auxiliares");
      setProfessores(resAux.data.professores);
      setDisciplinas(resAux.data.disciplinas);

      const resGrade = await api.get(`/alocacoes/turma/${id}`);
      setAlocacoes(resGrade.data);
    } catch (error) {
      console.error("Erro ao carregar dados da grade:", error);
    }
  };

  const handleVincular = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.id_professor || !formData.id_disciplina) {
      return alert("Selecione um professor e uma disciplina.");
    }

    setIsSubmitting(true);
    try {
      await api.post("/alocacoes", {
        id_turma: id,
        id_professor: formData.id_professor,
        id_disciplina: formData.id_disciplina,
        ano_letivo: turma.ano_letivo,
      });
      alert("Professor vinculado com sucesso!");
      setFormData({ id_professor: "", id_disciplina: "" });
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao vincular.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemover = async (id_alocacao) => {
    if (window.confirm("Deseja remover este professor da turma?")) {
      try {
        await api.delete(`/alocacoes/${id_alocacao}`);
        carregarDados();
      } catch (error) {
        alert("Erro ao remover vínculo.");
      }
    }
  };

  return (
    <div className="page-body" style={{ padding: "20px" }}>
      {/* HEADER DA PÁGINA COM O DESIGN COMPACTO E ROBUSTO */}
      <div
        className="filter-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "3px" }}>Grade Curricular</h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Gerenciando professores da turma:{" "}
            <strong style={{ color: "#333" }}>
              {turma.nome_turma} ({turma.ano_letivo})
            </strong>
          </p>
        </div>

        <Link
          to="/turmas"
          className="btn-back"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          Voltar para Turmas
        </Link>
      </div>

      {/* CARD CENTRAL - FORMULÁRIO DE VÍNCULO */}
      <div className="content-card" style={{ marginBottom: "25px" }}>
        {/* SUBTÍTULO INTERNO COM ÍCONE COERENTE */}
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
            Vincular Professor à Disciplina
          </span>
        </div>

        <form onSubmit={handleVincular} className="custom-form">
          <div className="form-row" style={{ display: "flex", gap: "20px" }}>
            {/* Campo Professor */}
            <div className="form-group" style={{ flex: 1 }}>
              <label
                className="form-label"
                style={{
                  marginBottom: "8px",
                  display: "block",
                  fontWeight: "600",
                }}
              >
                Professor <span className="required-star">*</span>
              </label>
              <select
                className="form-control"
                value={formData.id_professor}
                onChange={(e) =>
                  setFormData({ ...formData, id_professor: e.target.value })
                }
                required
                // Aumentei o padding para 16px para deixar a caixa bem maior
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              >
                <option value="">Selecione o Professor...</option>
                {professores.map((p) => (
                  <option key={p.id_professor} value={p.id_professor}>
                    {p.nome_completo}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo Disciplina */}
            <div className="form-group" style={{ flex: 1 }}>
              <label
                className="form-label"
                style={{
                  marginBottom: "8px",
                  display: "block",
                  fontWeight: "600",
                }}
              >
                Disciplina <span className="required-star">*</span>
              </label>
              <select
                className="form-control"
                value={formData.id_disciplina}
                onChange={(e) =>
                  setFormData({ ...formData, id_disciplina: e.target.value })
                }
                required
                // Aumentei o padding para 16px para deixar a caixa bem maior
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              >
                <option value="">Selecione a Disciplina...</option>
                {disciplinas.map((d) => (
                  <option key={d.id_disciplina} value={d.id_disciplina}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Restante do código (HR e Botão) permanece o mesmo */}
          <hr
            className="form-divider"
            style={{ marginTop: "30px", marginBottom: "25px" }}
          />

          <div className="btn-group">
            <button
              type="submit"
              className="btn-save"
              disabled={isSubmitting}
              style={{ padding: "15px 30px", fontSize: "18px" }}
            >
              {isSubmitting ? "Vinculando..." : "Vincular à Grade"}
            </button>
          </div>
        </form>
      </div>

      {/* CARD CENTRAL - TABELA DE VÍNCULOS EXISTENTES */}
      <div className="content-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "35px", color: "#04225c" }}
          >
            list_alt
          </span>
          <span style={{ fontWeight: "800", fontSize: "20px", color: "#333" }}>
            Disciplinas e Professores Alocados
          </span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>N°</th>
              <th>Nome da Disciplina</th>
              <th>Professor Responsável</th>
              <th style={{ width: "120px", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alocacoes.length > 0 ? (
              alocacoes.map((aloc, index) => {
                const numeroFormatado = String(index + 1).padStart(2, "0");

                return (
                  <tr key={aloc.id_alocacao}>
                    <td>{numeroFormatado}</td>
                    <td>
                      <span style={{ fontWeight: "600", color: "#333" }}>
                        {aloc.nome_disciplina}
                      </span>
                    </td>
                    <td>{aloc.nome_professor}</td>

                    {/* BOTÃO REMOVER ALINHADO COM AÇÃO PRINCIPAL (ÍCONE GRANDE DE LIXEIRA) */}
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => handleRemover(aloc.id_alocacao)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          color: "#d32f2f",
                          transition: "color 0.2s ease",
                        }}
                        title="Remover da Grade"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "26px" }}
                        >
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#737373",
                  }}
                >
                  Nenhum professor vinculado a esta turma ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeTurma;
