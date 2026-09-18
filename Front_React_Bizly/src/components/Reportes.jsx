// src/components/Reportes.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css'; 
import './Ventas.css'; 
import './Reportes.css'; 

function Reportes() {
  // Estados para los filtros de fecha
  const [fechaInicio, setFechaInicio] = useState('2026-09-01');
  const [fechaFin, setFechaFin] = useState('2026-09-07');

  return (
    <div className="admin-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-header">
          <div>
            <div className="breadcrumbs">Bizly / Reportes</div>
            <h1>Reportes</h1>
            <p className="subtitle">Análisis generado por el backend y exportación de datos</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">⭳ Exportar período</button>
            <div className="header-user" style={{marginLeft: '20px'}}>
              <strong>Admin Bizly</strong>
            </div>
          </div>
        </header>

        {/* Barra de filtro de fechas */}
        <div className="date-filter-bar">
          <span className="date-label">Período:</span>
          <input 
            type="date" 
            value={fechaInicio} 
            onChange={(e) => setFechaInicio(e.target.value)} 
            className="date-input" 
          />
          <span className="date-label">hasta</span>
          <input 
            type="date" 
            value={fechaFin} 
            onChange={(e) => setFechaFin(e.target.value)} 
            className="date-input" 
          />
        </div>

        {/* 4 Tarjetas de resumen */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Ventas del período</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Ingresos</div>
            <div className="stat-value">$ 0</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Ticket promedio</div>
            <div className="stat-value">$ 0</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">IVA recaudado</div>
            <div className="stat-value">$ 0</div>
          </div>
        </div>

        {/* Paneles de Gráficos */}
        <div className="dashboard-panels" style={{ marginBottom: '20px' }}>
          <div className="panel chart-panel">
            <h3>TENDENCIA MENSUAL (6 MESES)</h3>
            <div className="placeholder-content" style={{ height: '250px' }}>
              <div className="chart-mockup">
                <div className="y-axis">
                  <span>$ 0k</span><span>$ 0k</span><span>$ 0k</span><span>$ 0k</span>
                  <span>$ 0k</span><span>$ 0k</span><span>$ 0k</span><span>$ 0k</span>
                </div>
                <div className="x-axis">
                  <span>abr de 26</span><span>may de 26</span><span>jun de 26</span>
                  <span>jul de 26</span><span>ago de 26</span><span>sept de 26</span>
                </div>
              </div>
            </div>
          </div>
          <div className="panel list-panel">
            <h3>MÉTODOS DE PAGO</h3>
            <div className="placeholder-content" style={{ height: '250px', border: 'none' }}>
              Sin datos en el período
            </div>
          </div>
        </div>

        {/* Tabla Inferior: Top Productos */}
        <div className="panel table-panel">
          <h3>TOP 5 PRODUCTOS POR INGRESOS</h3>
          <table className="bizly-table">
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>UNIDADES</th>
                <th>INGRESOS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="empty-state" style={{ padding: '40px' }}>
                  Sin datos en el período
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default Reportes;