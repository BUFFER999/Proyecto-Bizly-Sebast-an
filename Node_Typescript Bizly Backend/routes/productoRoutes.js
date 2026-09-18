// routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Ruta GET para obtener (La que ya tenías)
router.get('/', productoController.obtenerProductos);

// 👇 NUEVA RUTA POST para guardar
router.post('/', productoController.crearProducto);

module.exports = router;