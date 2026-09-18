// controllers/ventasController.js
const db = require('../config/db');

// --- 1. FUNCIÓN PARA CREAR VENTAS ---
exports.crearVenta = async (req, res) => {
  try {
    const { id_cliente, id_vendedor, total, metodo_pago, carrito } = req.body;
    const numero_factura = 'FAC-' + Date.now(); 
    
    const [ventaResult] = await db.query(
      `INSERT INTO ventas (id_cliente, id_vendedor, numero_factura, estado, subtotal, total, metodo_pago)
       VALUES (?, ?, ?, 'Completada', ?, ?, ?)`,
      [id_cliente || 1, id_vendedor, numero_factura, total, total, metodo_pago || 'Efectivo']
    );

    const id_venta = ventaResult.insertId;

    for (let item of carrito) {
      await db.query(
        `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unit, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [id_venta, item.id, item.cantidad, item.precio_venta, item.cantidad * item.precio_venta]
      );

      await db.query(
        `UPDATE productos SET stock_actual = stock_actual - ? WHERE id = ?`,
        [item.cantidad, item.id]
      );
    }

    res.status(201).json({ 
      mensaje: 'Venta registrada con éxito', 
      id_venta: id_venta, 
      numero_factura 
    });

  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ error: 'Error en el servidor al procesar la venta' });
  }
}; // <-- AQUÍ SE CIERRA CORRECTAMENTE CREAR VENTA


// --- 2. FUNCIÓN PARA OBTENER VENTAS (DASHBOARD) ---
// 👇 Ahora sí está afuera y es independiente
exports.obtenerVentas = async (req, res) => {
  try {
    const [ventas] = await db.query('SELECT * FROM ventas ORDER BY created_at DESC');
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ error: 'Error de servidor al cargar ventas' });
  }
};