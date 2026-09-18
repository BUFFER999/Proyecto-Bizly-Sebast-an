const db = require('../config/db'); // Asegúrate de que esta sea la ruta correcta a tu conexión de MySQL

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE activo = 1');
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error en el servidor al obtener clientes" });
    }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
    try {
        const { documento, nombre, apellido, telefono, email, direccion } = req.body;
        const [resultado] = await db.query(
            'INSERT INTO clientes (documento, nombre, apellido, telefono, email, direccion, activo) VALUES (?, ?, ?, ?, ?, ?, 1)',
            [documento, nombre, apellido || '', telefono, email, direccion || '']
        );
        res.status(201).json({ mensaje: "Cliente creado con éxito", id: resultado.insertId });
    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({ mensaje: "Error al registrar el cliente" });
    }
};

module.exports = {
    obtenerClientes,
    crearCliente
};