const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productoRoutes = require('./routes/productoRoutes');
app.use('/api/productos', productoRoutes);

const clienteRoutes = require('./routes/clienteRoutes');
app.use('/api/clientes', clienteRoutes);

const ventasRoutes = require('./routes/ventasRoutes');
app.use('/api/ventas', ventasRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensaje: 'Backend de Bizly en línea ' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});