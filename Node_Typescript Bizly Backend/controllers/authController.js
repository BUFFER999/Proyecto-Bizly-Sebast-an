// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor ingresa correo y contraseña' });
  }

  try {
    // 1. Buscamos al usuario solo por su email y validamos que esté activo
    const [rows] = await db.query(
      'SELECT id, id_rol, nombre, apellido, email, password_hash FROM usuarios WHERE email = ? AND activo = 1',
      [email]
    );

    // Si no devuelve nada, el correo no existe o está inactivo
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    const usuario = rows[0];

    // 2. Comparamos la contraseña en texto plano del frontend con el hash de la BD
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // 3. Si todo está correcto, damos acceso
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        id_rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ error: 'Error de servidor al intentar iniciar sesión' });
  }
};