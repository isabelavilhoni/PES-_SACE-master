const express = require("express");
const router = express.Router();
const controller = require("../controllers/periodoLetivoController");

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.cadastrar);
router.put("/ativar/:id", controller.ativarPeriodo);
router.put("/encerrar/:id", controller.encerrar);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
