const db = require("../confing/database");

const alunoController = {
  index: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM aluno ORDER BY nome_completo ASC");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    const { nome_completo, cpf, data_nascimento, telefone, matricula } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO aluno (nome_completo, cpf, data_nascimento, telefone, matricula) VALUES (?, ?, ?, ?, ?)",
        [nome_completo, cpf, data_nascimento, telefone, matricula]
      );
      res.status(201).json({ message: "Aluno cadastrado com sucesso!", id_aluno: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  matricular: async (req, res) => {
    const { id_aluno, id_turma } = req.body;
    try {
      await db.query(
        "INSERT INTO matricula (id_aluno, id_turma, situacao) VALUES (?, ?, 'Ativo')",
        [id_aluno, id_turma]
      );
      res.status(201).json({ message: "Aluno matriculado na turma com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = alunoController;