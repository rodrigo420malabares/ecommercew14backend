// Si lo ponés en routes/productos.js:
const { buscarProductos } = require('../controllers/productos');

// ... tus otras rutas ...

// Ruta nueva:
router.get('/buscar/:termino', buscarProductos);