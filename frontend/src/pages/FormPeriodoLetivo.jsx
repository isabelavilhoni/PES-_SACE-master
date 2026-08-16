import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const FormPeriodoLetivo = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Detecta se é edição pelo ID na URL

  const [nome, setNome] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega os dados se for uma edição
  useEffect(() => {
    if (id) {
      const fetchPeriodo = async () => {
        try {
          const response = await api.get(`/periodo-letivo/${id}`);
          const p = response.data;

          // Trava de segurança: não editar se estiver encerrado
          if (p.status === "encerrado") {
            alert("Este período está encerrado e não pode ser editado.");
            navigate("/periodos");
            return;
          }

          setNome(p.nome);
          // O .split("T")[0] converte a data do banco para o formato do input date
          setDataInicio(p.data_inicio ? p.data_inicio.split("T")[0] : "");
          setDataFim(p.data_fim ? p.data_fim.split("T")[0] : "");
        } catch (error) {
          console.error(error);
          alert("Erro ao carregar dados para edição.");
        }
      };
      fetchPeriodo();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!nome.trim()) {
      return alert("Por favor, informe um nome válido para o período.");
    }
    if (new Date(dataInicio) >= new Date(dataFim)) {
      return alert("A data de início deve ser anterior à data de fim.");
    }

    setIsSubmitting(true);

    try {
      const dados = {
        nome: nome.trim(),
        data_inicio: dataInicio,
        data_fim: dataFim,
      };

      if (id) {
        // Modo Edição
        await api.put(`/periodo-letivo/${id}`, dados);
        alert("Período atualizado com sucesso!");
      } else {
        // Modo Cadastro
        await api.post("/periodo-letivo", dados);
        alert("Período letivo cadastrado com sucesso!");
      }
      navigate("/periodos");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao salvar período.");
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
            {id ? "Editar Período" : "Novo Período"}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            {id
              ? "Altere os dados do período letivo."
              : "Preencha os dados do período letivo correspondente."}
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
            event_note
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Dados do Período Letivo
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Nome do Período (Ex: 2026/2){" "}
                <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: 2026/2"
                maxLength="50"
                required
              />
            </div>
          </div>

          <div className="form-row" style={{ display: "flex", gap: "20px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Data de Início <span className="required-star">*</span>
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Data de Fim <span className="required-star">*</span>
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="btn-group" style={{ marginTop: "30px" }}>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : id
                ? "Atualizar Período"
                : "Cadastrar Período"}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/periodos")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPeriodoLetivo;
