import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ListaProfessores = () => {
  const [professores, setProfessores] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  const removerAcentos = (texto) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return "Não cadastrado";
    const numeros = cpf.replace(/\D/g, "");
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return "Não informado";
    const cleaned = ("" + telefone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return telefone;
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      const response = await api.get("/professores");
      setProfessores(response.data);
    } catch (error) {
      console.error("Erro ao buscar professor:", error);
    }
  };

  const handleToggleStatus = async (id, statusAtual) => {
    const novoStatus = statusAtual === 1 ? 0 : 1;
    const mensagem =
      statusAtual === 1
        ? "Você tem certeza que deseja deixar este professor inativo?"
        : "Você deseja ativar o status deste professor?";

    const confirmar = window.confirm(mensagem);
    if (!confirmar) return;

    try {
      await api.put(`/professores/status/${id}`, { ativo: novoStatus });
      fetchProfessores();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status do professor.");
    }
  };

  const handleExcluir = async (id, status) => {
    if (status === 0) {
      alert(
        "Atenção: Professores inativos não podem ser excluídos. Ative-os antes de realizar esta ação."
      );
      return;
    }

    const confirmar = window.confirm(
      "ATENÇÃO: Esta ação é definitiva e removerá o professor do banco. Deseja continuar?"
    );
    if (!confirmar) return;

    try {
      await api.delete(`/professores/${id}`);
      fetchProfessores();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert(error.response?.data?.message || "Erro ao excluir professor.");
    }
  };

  const professoresFiltrados = professores.filter((professor) => {
    const termo = removerAcentos(filtro);
    return (
      removerAcentos(professor.nome_completo || professor.login || "").includes(
        termo
      ) ||
      removerAcentos(professor.cpf || "").includes(termo) ||
      removerAcentos(professor.email || "").includes(termo) ||
      removerAcentos(professor.telefone || "").includes(termo)
    );
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "3px" }}>Professores</h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Gerencie o cadastro de professores da escola.
          </p>
        </div>
        <button
          className="btn-new-discipline"
          onClick={() => navigate("/professores/novo")}
        >
          + Novo Professor
        </button>
      </div>

      <div className="content-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "35px", color: "#04225c" }}
          >
            co_present
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Buscar professor
          </span>
        </div>
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Buscar por nome, cpf, e-mail ou telefone..."
            className="search-input-large"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="content-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Nome do professor</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {professoresFiltrados.map((d, i) => (
              <tr
                key={d.id_usuario}
                style={{ opacity: d.ativo === 0 ? 0.6 : 1 }}
              >
                <td>{String(i + 1).padStart(2, "0")}</td>
                <td>{d.nome_completo || d.login}</td>
                <td>{formatarCPF(d.cpf)}</td>
                <td>{d.email || d.login}</td>
                <td>{formatarTelefone(d.telefone)}</td>
                <td>
                  <span
                    style={{
                      color: d.ativo === 1 ? "#2a9d8f" : "#333",
                      fontSize: "20px",
                    }}
                  >
                    {d.ativo === 1 ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="actions-cell" style={{ textAlign: "center" }}>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      if (d.ativo === 0) {
                        alert("Professor inativo não pode ser editado.");
                        return;
                      }
                      navigate(`/professores/editar/${d.id_usuario}`);
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#0055ff" }}
                    >
                      edit
                    </span>
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleToggleStatus(d.id_usuario, d.ativo)}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: d.ativo === 1 ? "#2a9d8f" : "#333" }}
                    >
                      {d.ativo === 1 ? "check_circle" : "block"}
                    </span>
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleExcluir(d.id_usuario, d.ativo)}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: d.ativo === 0 ? "#ccc" : "#d32f2f" }}
                    >
                      delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaProfessores;
