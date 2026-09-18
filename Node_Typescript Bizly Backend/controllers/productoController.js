const db = require('../config/db');

// Función para obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos');
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener el inventario:', error);
    res.status(500).json({ error: 'Error de servidor al cargar productos' });
  }
};

// NUEVA FUNCIÓN PARA CREAR PRODUCTOS
exports.crearProducto = async (req, res) => {
  try {
    // Extraemos los datos que nos enviará React
    const { nombre, codigo, id_categoria, precio_venta, stock_actual } = req.body;

    // Hacemos la inserción en tu tabla MySQL
    const [result] = await db.query(
      `INSERT INTO productos 
      (nombre, codigo, id_categoria, precio_venta, stock_actual, stock_minimo, id_proveedor, activo) 
      VALUES (?, ?, ?, ?, ?, 15, 25, 1)`,
      [nombre, codigo, id_categoria, precio_venta, stock_actual]
    );

    res.status(201).json({ 
      mensaje: 'Producto creado con éxito', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar' });
  }
};