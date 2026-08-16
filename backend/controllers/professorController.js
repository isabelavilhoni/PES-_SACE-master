const db = require("../confing/database");
const bcrypt = require("bcrypt");

const professorController = {
  listar: async (req, res) => {
    try {
      const sql = "SELECT id_usuario, login, perfil, ativo, nome_completo, cpf, telefone, email FROM usuario WHERE perfil = 'Professor' ORDER BY nome_completo ASC";
      const [results] = await db.query(sql);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    const { login, senha, nome_completo, cpf, telefone, email } = req.body;
    try {
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      const [result] = await db.query(
        "INSERT INTO usuario (login, senha, perfil, nome_completo, cpf, telefone, email) VALUES (?, ?, 'Professor', ?, ?, ?, ?)",
        [login, senhaHash, nome_completo, cpf, telefone, email]
      );
      res.status(201).json({ message: "Professor cadastrado com sucesso!", id_usuario: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = professorController;