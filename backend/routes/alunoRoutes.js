const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");

// Agora, quando você chama alunoController.index, ele aponta para a função existente
router.get("/", alunoController.index);
router.get("/:id", alunoController.show);
router.post("/", alunoController.store);
router.put("/:id", alunoController.update);
router.delete("/:id", alunoController.delete);

module.exports = router; // <--- O SEGREDO ESTÁ AQUI
