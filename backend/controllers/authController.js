const db = require("../confing/database");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ message: "Login e senha são obrigatórios!" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE login = ? AND ativo = 1", [login]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado ou inativo." });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    delete usuario.senha;
    
    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario
    });

  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

module.exports = { login };