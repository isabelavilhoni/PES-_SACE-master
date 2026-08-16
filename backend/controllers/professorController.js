const db = require("../confing/database");
const bcrypt = require("bcrypt");

const professorController = {
  // 1. LISTAR PROFESSORES
  listar: async (req, res) => {
    try {
      const sql =
        "SELECT id_usuario, login, perfil, ativo, nome_completo, cpf, telefone, email FROM USUARIO WHERE perfil = 'Professor' ORDER BY nome_completo ASC";
      const [results] = await db.query(sql);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar professores." });
    }
  },

  // 2. BUSCAR POR ID
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const sql =
        "SELECT id_usuario, login, perfil, ativo, nome_completo, cpf, telefone, email FROM USUARIO WHERE id_usuario = ? AND perfil = 'Professor'";
      const [results] = await db.query(sql, [id]);

      if (results.length === 0) {
        return res.status(404).json({ message: "Professor não encontrado." });
      }
      res.json(results[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar professor." });
    }
  },

  // 3. CADASTRAR
  cadastrar: async (req, res) => {
    try {
      const { login, senha, nome_completo, cpf, telefone, email } = req.body;
      const hashSenha = await bcrypt.hash(senha, 10);

      const sql = `INSERT INTO USUARIO (login, senha, perfil, ativo, nome_completo, cpf, telefone, email) 
                   VALUES (?, ?, 'Professor', 1, ?, ?, ?, ?)`;

      await db.query(sql, [
        login,
        hashSenha,
        nome_completo,
        cpf,
        telefone,
        email,
      ]);

      res.status(201).json({ message: "Professor cadastrado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao cadastrar professor." });
    }
  },

  // 4. ATUALIZAR DADOS
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { login, nome_completo, cpf, telefone, email, senha } = req.body;

      if (senha) {
        const hashSenha = await bcrypt.hash(senha, 10);
        const sql =
          "UPDATE USUARIO SET login = ?, senha = ?, nome_completo = ?, cpf = ?, telefone = ?, email = ? WHERE id_usuario = ? AND perfil = 'Professor'";
        await db.query(sql, [
          login,
          hashSenha,
          nome_completo,
          cpf,
          telefone,
          email,
          id,
        ]);
      } else {
        const sql =
          "UPDATE USUARIO SET login = ?, nome_completo = ?, cpf = ?, telefone = ?, email = ? WHERE id_usuario = ? AND perfil = 'Professor'";
        await db.query(sql, [login, nome_completo, cpf, telefone, email, id]);
      }

      res.json({ message: "Dados do professor atualizados!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar professor." });
    }
  },

  // 5. ATUALIZAR STATUS
  atualizarStatus: async (req, res) => {
    const { id } = req.params;
    const { ativo } = req.body;

    try {
      const sql =
        "UPDATE USUARIO SET ativo = ? WHERE id_usuario = ? AND perfil = 'Professor'";
      await db.query(sql, [ativo, id]);
      res.json({ message: "Status do professor atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar status no banco." });
    }
  },

  // 6. EXCLUIR
  excluir: async (req, res) => {
    try {
      const { id } = req.params;

      const [vinculo] = await db.query(
        "SELECT * FROM ALOCACAO WHERE id_professor = ?",
        [id]
      );

      if (vinculo.length > 0) {
        return res.status(400).json({
          message:
            "Não é possível excluir: este professor possui disciplinas vinculadas em turmas.",
        });
      }

      await db.query(
        "DELETE FROM USUARIO WHERE id_usuario = ? AND perfil = 'Professor'",
        [id]
      );
      res.json({ message: "Professor removido do sistema." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao excluir professor." });
    }
  },
};

module.exports = professorController;
