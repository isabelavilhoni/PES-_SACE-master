const db = require("../confing/database");

const alunoController = {
  // =========================================
  // LISTAR TODOS (Agora sem JOIN com Turma)
  // =========================================
  index: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT * FROM ALUNO
        ORDER BY nome_completo ASC
      `);

      res.status(200).json(rows);
    } catch (err) {
      console.error("ERRO COMPLETO:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =========================================
  // BUSCAR UM ALUNO
  // =========================================
  show: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM ALUNO WHERE id_aluno = ?", [
        req.params.id,
      ]);
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error("ERRO COMPLETO:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =========================================
  // CADASTRAR
  // =========================================
  store: async (req, res) => {
    const { matricula, nome_completo, data_nascimento, cpf, telefone } =
      req.body;

    try {
      const [alunoExistente] = await db.query(
        "SELECT id_aluno FROM ALUNO WHERE matricula = ?",
        [matricula]
      );

      if (alunoExistente.length > 0) {
        return res
          .status(400)
          .json({ message: "Erro: Matrícula já cadastrada." });
      }

      const sql = `
        INSERT INTO ALUNO (matricula, nome_completo, data_nascimento, cpf, telefone)
        VALUES (?, ?, ?, ?, ?)
      `;

      await db.query(sql, [
        matricula,
        nome_completo,
        data_nascimento,
        cpf,
        telefone,
      ]);

      res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
    } catch (err) {
      console.error("ERRO COMPLETO:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =========================================
  // ATUALIZAR (Versão com proteção de duplicidade na edição)
  // =========================================
  update: async (req, res) => {
    const { matricula, nome_completo, data_nascimento, cpf, telefone } =
      req.body;

    try {
      // Verifica se a matrícula já pertence a OUTRO aluno
      const [alunoExistente] = await db.query(
        "SELECT id_aluno FROM ALUNO WHERE matricula = ? AND id_aluno != ?",
        [matricula, req.params.id]
      );

      if (alunoExistente.length > 0) {
        return res
          .status(400)
          .json({
            message:
              "Erro: Esta matrícula já está sendo usada por outro aluno.",
          });
      }

      const sql = `
        UPDATE ALUNO
        SET matricula = ?, nome_completo = ?, data_nascimento = ?, cpf = ?, telefone = ?
        WHERE id_aluno = ?
      `;

      await db.query(sql, [
        matricula,
        nome_completo,
        data_nascimento,
        cpf,
        telefone,
        req.params.id,
      ]);

      res.status(200).json({ message: "Atualizado com sucesso!" });
    } catch (err) {
      console.error("ERRO COMPLETO:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =========================================
  // DELETAR (Mantém igual)
  // =========================================
  delete: async (req, res) => {
    try {
      await db.query("DELETE FROM ALUNO WHERE id_aluno = ?", [req.params.id]);
      res.status(200).json({ message: "Deletado com sucesso!" });
    } catch (err) {
      console.error("ERRO COMPLETO:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = alunoController;
