const db = require("../confing/database");

const turmaController = {
  // 1. LISTAR TODAS AS TURMAS
  index: async (req, res) => {
    try {
      // Como a turma agora não tem um único professor fixo (é resolvido na ALOCACAO),
      // buscamos apenas os dados diretos da tabela TURMA.
      const sql =
        "SELECT * FROM TURMA ORDER BY ano_letivo DESC, nome_turma ASC";
      const [turmas] = await db.query(sql);
      return res.status(200).json(turmas);
    } catch (error) {
      console.error("Erro ao listar turmas:", error);
      return res.status(500).json({ message: "Erro ao buscar turmas." });
    }
  },

  // 2. BUSCAR UMA TURMA ESPECÍFICA
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const sql = "SELECT * FROM TURMA WHERE id_turma = ?";
      const [turma] = await db.query(sql, [id]);

      if (turma.length === 0) {
        return res.status(404).json({ message: "Turma não encontrada." });
      }
      return res.status(200).json(turma[0]);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar dados da turma." });
    }
  },

  // 3. CRIAR NOVA TURMA
  store: async (req, res) => {
    try {
      const { nome_turma, ano_letivo } = req.body;
      const sql = "INSERT INTO TURMA (nome_turma, ano_letivo) VALUES (?, ?)";
      const [result] = await db.query(sql, [nome_turma, ano_letivo]);

      return res.status(201).json({
        message: "Turma cadastrada com sucesso!",
        id_turma: result.insertId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao cadastrar turma." });
    }
  },

  // 4. ATUALIZAR TURMA
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome_turma, ano_letivo } = req.body;
      const sql =
        "UPDATE TURMA SET nome_turma = ?, ano_letivo = ? WHERE id_turma = ?";
      await db.query(sql, [nome_turma, ano_letivo, id]);

      return res.status(200).json({ message: "Turma atualizada com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao atualizar turma." });
    }
  },

  // 5. EXCLUIR TURMA
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM ALOCACAO WHERE id_turma = ?", [id]);
      await db.query("DELETE FROM MATRICULA WHERE id_turma = ?", [id]);

      const sql = "DELETE FROM TURMA WHERE id_turma = ?";
      await db.query(sql, [id]);

      return res.status(200).json({ message: "Turma excluída com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao excluir turma." });
    }
  }, // <--- A VÍRGULA TEM QUE ESTAR AQUI!

  // 6. ATUALIZAR STATUS DA TURMA
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      const sql = "UPDATE TURMA SET ativo = ? WHERE id_turma = ?";
      await db.query(sql, [ativo, id]);

      return res
        .status(200)
        .json({ message: "Status atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar status da turma." });
    }
  },
};

module.exports = turmaController;
