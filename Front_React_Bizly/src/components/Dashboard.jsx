// src/components/Dashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import './Dashboard.css';

function Dashboard() {
  const { usuario } = useContext(AuthContext);
  
  // Estados para guardar los datos reales
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Función para traer ventas y productos al mismo tiempo
  const cargarDatosDashboard = async () => {
    try {
      const [resVentas, resProductos] = await Promise.all([
        fetch('http://localhost:5000/api/ventas'),
        fetch('http://localhost:5000/api/productos')
      ]);

      if (resVentas.ok && resProductos.ok) {
        const dataVentas = await resVentas.json();
        const dataProductos = await resProductos.json();
        
        setVentas(dataVentas);
        setProductos(dataProductos);
      }
    } catch (error) {
      console.error("Error cargando los datos del Dashboard:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  // 🧮 CÁLCULOS MATEMÁTICOS PARA LAS MÉTRICAS
  // 1. Ingresos Totales (Suma de la columna 'total' de todas las ventas)
  const ingresosTotales = ventas.reduce((acc, venta) => acc + Number(venta.total), 0);
  
  // 2. Cantidad de ventas realizadas
  const totalVentas = ventas.length;

  // 3. Productos con stock bajo
  const stockBajo = productos.filter(p => p.stock_actual <= p.stock_minimo).length;

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div>
            <div className="breadcrumbs">Bizly / Dashboard</div>
            <h1>Bienvenido de vuelta, {usuario?.nombre} 👋</h1>
            <p className="subtitle">Aquí tienes el resumen de tu negocio de hoy.</p>
          </div>
          <div className="header-user">
            <strong>{usuario?.nombre} {usuario?.apellido}</strong>
            <span className="user-role">{usuario?.rol || 'Administrador'}</span>
          </div>
        </header>

        {cargando ? (
          <p>Cargando métricas de Bizly...</p>
        ) : (
          <div className="metrics-grid">
            {/* Tarjeta 1: Ingresos Totales */}
            <div className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>💰</div>
              <div className="metric-info">
                <h3>Ingresos Totales</h3>
                <p className="metric-value">$ {ingresosTotales.toLocaleString()}</p>
                <span className="metric-trend positive">↑ En tiempo real</span>
              </div>
            </div>

            {/* Tarjeta 2: Ventas Realizadas */}
            <div className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>🧾</div>
              <div className="metric-info">
                <h3>Ventas Realizadas</h3>
                <p className="metric-value">{totalVentas}</p>
                <span className="metric-trend">Facturas emitidas</span>
              </div>
            </div>

            {/* Tarjeta 3: Alertas de Inventario */}
            <div className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>⚠️</div>
              <div className="metric-info">
                <h3>Alertas de Stock</h3>
                <p className="metric-value">{stockBajo}</p>
                <span className="metric-trend negative">Productos por agotar</span>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Actividad Reciente */}
        <section className="recent-activity" style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3>Últimas 5 ventas</h3>
          {ventas.length === 0 ? (
            <p style={{ color: '#666', marginTop: '10px' }}>No hay ventas registradas aún.</p>
          ) : (
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Factura</th>
                  <th style={{ padding: '10px' }}>Método de Pago</th>
                  <th style={{ padding: '10px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Mostramos solo las últimas 5 ventas usando slice */}
                {ventas.slice(0, 5).map(venta => (
                  <tr key={venta.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', color: '#4f46e5', fontWeight: 'bold' }}>{venta.numero_factura}</td>
                    <td style={{ padding: '10px' }}>{venta.metodo_pago}</td>
                    <td style={{ padding: '10px' }}>$ {Number(venta.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

      </main>
    </div>
  );
}

export default Dashboard;