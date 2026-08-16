import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ListaDisciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [busca, setBusca] = useState("");

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || {};
  const ehCoordenacao = usuarioLogado?.perfil === "Coordenacao";

  const carregarDisciplinas = async () => {
    try {
      const response = await api.get("/disciplinas");
      setDisciplinas(response.data);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
    }
  };

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const handleToggleStatus = async (id, statusAtual) => {
    const mensagem =
      statusAtual === 1
        ? "Deseja inativar esta disciplina?"
        : "Deseja ativar esta disciplina?";

    if (!window.confirm(mensagem)) return;

    try {
      const novoStatus = statusAtual === 1 ? 0 : 1;
      await api.put(`/disciplinas/${id}/status`, { ativo: novoStatus });
      setDisciplinas((prev) =>
        prev.map((d) =>
          d.id_disciplina === id ? { ...d, ativo: novoStatus } : d
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao alterar o status.");
    }
  };

  const handleExcluir = async (id, status) => {
    // Trava: Impede exclusão se estiver inativo
    if (status === 0) {
      alert(
        "Atenção: Disciplinas inativas não podem ser excluídas. Ative-as antes de realizar esta ação."
      );
      return;
    }

    if (
      !window.confirm(
        "ATENÇÃO: Deseja realmente excluir esta disciplina permanentemente?"
      )
    )
      return;

    try {
      await api.delete(`/disciplinas/${id}`);
      setDisciplinas((prev) => prev.filter((d) => d.id_disciplina !== id));
      alert("Disciplina excluída com sucesso!");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao excluir disciplina.");
    }
  };

  const filtradas = disciplinas.filter((d) =>
    (d.nome || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="page-body" style={{ padding: "20px" }}>
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
          <h1 style={{ marginBottom: "3px" }}>Disciplinas</h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Gerencie as matérias e cargas horárias da escola.
          </p>
        </div>

        {ehCoordenacao && (
          <Link
            to="/disciplinas/nova"
            className="btn-save"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "13px 24px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            <span className="material-symbols-outlined">add</span> Nova
            Disciplina
          </Link>
        )}
      </div>

      <div className="content-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "15px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "35px", color: "#04225c" }}
          >
            menu_book
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Buscar disciplina
          </span>
        </div>

        <div className="search-container" style={{ marginBottom: "25px" }}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="search-input-large"
            placeholder="Buscar disciplina por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>N°</th>
              <th>Nome da disciplina</th>
              <th>Carga Horária</th>
              <th style={{ width: "120px" }}>Status</th>
              {ehCoordenacao && (
                <th style={{ width: "180px", textAlign: "center" }}>Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtradas.length > 0 ? (
              filtradas.map((d, index) => {
                const isInativa = d.ativo !== 1;
                return (
                  <tr
                    key={d.id_disciplina}
                    style={{ opacity: isInativa ? 0.5 : 1 }}
                  >
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>
                      <span style={{ color: "#333" }}>{d.nome}</span>
                    </td>
                    <td>{d.carga_horaria} horas</td>
                    <td>
                      <span
                        style={{
                          fontWeight: "400",
                          color: !isInativa ? "#2a9d8f" : "#333",
                        }}
                      >
                        {!isInativa ? "Ativo" : "Inativo"}
                      </span>
                    </td>

                    {ehCoordenacao && (
                      <td style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "15px",
                          }}
                        >
                          <Link
                            to={
                              isInativa
                                ? "#"
                                : `/disciplinas/editar/${d.id_disciplina}`
                            }
                            onClick={(e) => {
                              if (isInativa) {
                                e.preventDefault();
                                alert(
                                  "Disciplinas inativas não podem ser editadas. Ative a disciplina antes de alterar seus dados."
                                );
                              }
                            }}
                            style={{
                              color: isInativa ? "#ccc" : "#0055ff",
                              display: "flex",
                              cursor: isInativa ? "not-allowed" : "pointer",
                            }}
                            title={
                              isInativa
                                ? "Disciplina inativa não pode ser editada"
                                : "Editar disciplina"
                            }
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "30px" }}
                            >
                              edit
                            </span>
                          </Link>

                          <button
                            onClick={() =>
                              handleToggleStatus(d.id_disciplina, d.ativo)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: !isInativa ? "#2a9d8f" : "#333",
                              display: "flex",
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "30px" }}
                            >
                              {!isInativa ? "check_circle" : "block"}
                            </span>
                          </button>

                          {/* Botão Excluir com Trava */}
                          <button
                            onClick={() =>
                              handleExcluir(d.id_disciplina, d.ativo)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: isInativa ? "not-allowed" : "pointer",
                              color: isInativa ? "#ccc" : "#d32f2f",
                              display: "flex",
                            }}
                            title={
                              isInativa
                                ? "Disciplina inativa não pode ser excluída"
                                : "Excluir disciplina"
                            }
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "30px" }}
                            >
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={ehCoordenacao ? "5" : "4"}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#737373",
                  }}
                >
                  Nenhuma disciplina encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaDisciplinas;
