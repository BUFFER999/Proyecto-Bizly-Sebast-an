const express = require('express');
const router = express.Router();
const { obtenerClientes, crearCliente } = require('../controllers/clienteController');

// Ruta para obtener la lista de clientes: GET /api/clientes
router.get('/', obtenerClientes);

// Ruta para registrar un nuevo cliente: POST /api/clientes
router.post('/', crearCliente);

module.exports = router;