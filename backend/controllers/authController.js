const db = require("../confing/database");
const bcrypt = require("bcrypt");

// LOGIN
const login = async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({
      message: "Login e senha são obrigatórios.",
    });
  }

  try {
    const sql =
      "SELECT id_usuario, login, senha, perfil, ativo FROM USUARIO WHERE login = ?";

    const [usuarios] = await db.query(sql, [login]);

    if (usuarios.length === 0) {
      return res.status(401).json({
        message: "Login inexistente ou senha incorreta.",
      });
    }

    const usuario = usuarios[0];

    let senhaValida = false;

    // Senha criptografada (professores)
    if (
      usuario.senha &&
      (usuario.senha.startsWith("$2a$") ||
        usuario.senha.startsWith("$2b$") ||
        usuario.senha.startsWith("$2y$"))
    ) {
      senhaValida = await bcrypt.compare(senha, usuario.senha);
    }
    // Senha em texto puro (coordenação/secretaria)
    else {
      senhaValida = senha === usuario.senha;
    }

    if (!senhaValida) {
      return res.status(401).json({
        message: "Login inexistente ou senha incorreta.",
      });
    }

    if (usuario.ativo === 0 || usuario.ativo === false) {
      return res.status(403).json({
        message: "Usuário inativo. Procure a coordenação.",
      });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id_usuario: usuario.id_usuario,
        login: usuario.login,
        perfil: usuario.perfil,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro no servidor ao tentar fazer login.",
    });
  }
};

// RECUPERAR SENHA
const recuperarSenha = async (req, res) => {
  const { login, cpf, novaSenha } = req.body;

  if (!login || !cpf || !novaSenha) {
    return res.status(400).json({
      message: "Login, CPF e nova senha são obrigatórios.",
    });
  }

  try {
    const [usuarios] = await db.query(
      `
      SELECT *
      FROM USUARIO
      WHERE login = ?
      AND cpf = ?
      AND perfil = 'Professor'
      `,
      [login, cpf.replace(/\D/g, "")]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        message: "Login ou CPF incorretos.",
      });
    }

    const hashNovaSenha = await bcrypt.hash(novaSenha, 10);

    await db.query("UPDATE USUARIO SET senha = ? WHERE login = ?", [
      hashNovaSenha,
      login,
    ]);

    return res.status(200).json({
      message: "Senha redefinida com sucesso!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao redefinir senha no servidor.",
    });
  }
};

module.exports = {
  login,
  recuperarSenha,
};
