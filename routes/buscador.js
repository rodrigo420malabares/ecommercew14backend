const { Router } = require('express');
const { buscarProductos } = require('../controllers/buscador'); // Asegurate que tu controlador se llame así

const router = Router();

// Esta ruta responderá a: /api/buscar/:termino
router.get('/:termino', buscarProductos);

module.exports = router;