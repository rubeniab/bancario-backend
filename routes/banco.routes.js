const express = require('express');
const router = express.Router();
const bancoController = require('../controllers/bancos.controller');

router.post('/filtros', bancoController.getByFiltros);
router.post('/reporte', bancoController.generarReporte); 

module.exports = router;
