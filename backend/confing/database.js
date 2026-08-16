const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "YES",
  database: "sge",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then(() => console.log("✅ Conectado ao banco sace_db (Modo Promise)!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MySQL:", err.message));

module.exports = db;
