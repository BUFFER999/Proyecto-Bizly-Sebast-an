// src/components/Clientes.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css'; 
import './Ventas.css'; // Reutilizamos el buscador y botones
import './Inventario.css'; // Reutilizamos la cuadrícula base
import './Clientes.css'; // Estilos específicos para las tarjetas de clientes

function Clientes() {
  // Estado para controlar la ventana flotante de Nuevo/Editar Cliente[cite: 1]
  const [modalAbierto, setModalAbierto] = useState(false);

  // Función para la alerta de desactivación[cite: 1]
  const confirmarDesactivacion = (nombreCliente) => {
    const confirmar = window.confirm(`¿Desactivar al cliente "${nombreCliente}"? Sus ventas históricas se conservarán.`);
    if (confirmar) {
      console.log(`Cliente ${nombreCliente} desactivado.`);
      // Más adelante, aquí irá la petición fetch para actualizar la base de datos
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-header">
          <div>
            <div className="breadcrumbs">Bizly / Clientes</div>
            <h1>Clientes</h1>
            <p className="subtitle">2 registrados</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setModalAbierto(true)}>
              + Nuevo cliente
            </button>
            <div className="header-user" style={{marginLeft: '20px'}}>
              <strong>Admin Bizly</strong>
            </div>
          </div>
        </header>

        {/* Buscador */}
        <div className="action-bar">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre, documento, teléfono o email..." 
              className="search-input" 
            />
          </div>
        </div>

        {/* Cuadrícula de Tarjetas de Clientes */}
        <div className="products-grid">
          
          {/* Tarjeta Cliente 1 */}
          <div className="product-card client-card">
            <div className="client-header">
              <div className="client-avatar">CD</div>
              <div className="client-info">
                <h4>Cliente Demostración Dos</h4>
                <span className="client-doc">CC 100000002</span>
              </div>
            </div>
            <div className="client-body">
              <div className="client-stats">
                <span>🛍️ 0 compras</span>
                <span className="client-spent">$ 0</span>
              </div>
              <div className="client-contact">
                <span>📞 3000000002</span>
                <span>✉️ cliente2@example.com</span>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn-action" onClick={() => setModalAbierto(true)}>✎ Editar</button>
              <button 
                className="btn-action danger" 
                onClick={() => confirmarDesactivacion("Cliente Demostración Dos")}
              >
                🗑 Desactivar
              </button>
            </div>
          </div>

          {/* Tarjeta Cliente 2 */}
          <div className="product-card client-card">
            <div className="client-header">
              <div className="client-avatar">CD</div>
              <div className="client-info">
                <h4>Cliente Demostración Uno</h4>
                <span className="client-doc">CC 100000001</span>
              </div>
            </div>
            <div className="client-body">
              <div className="client-stats">
                <span>🛍️ 0 compras</span>
                <span className="client-spent">$ 0</span>
              </div>
              <div className="client-contact">
                <span>📞 3000000001</span>
                <span>✉️ cliente1@example.com</span>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn-action" onClick={() => setModalAbierto(true)}>✎ Editar</button>
              <button 
                className="btn-action danger" 
                onClick={() => confirmarDesactivacion("Cliente Demostración Uno")}
              >
                🗑 Desactivar
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* --- VENTANA MODAL (Editar / Nuevo Cliente) --- */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '450px' }}>
            <div className="modal-header">
              <h2>Editar cliente</h2>
              <button className="close-btn" onClick={() => setModalAbierto(false)}>✕</button>
            </div>
            
            <form className="modal-body" onSubmit={(e) => { e.preventDefault(); setModalAbierto(false); }}>
              <div className="input-group">
                <label>Nombre completo <span>*</span></label>
                <input type="text" defaultValue="Cliente Demostración Dos" required />
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <label>Documento</label>
                  <input type="text" defaultValue="100000002" />
                </div>
                <div className="input-group">
                  <label>Tipo</label>
                  <select defaultValue="CC">
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="NIT">NIT</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Teléfono</label>
                  <input type="text" defaultValue="3000000002" />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" defaultValue="cliente2@example.com" />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: 'none', padding: '10px 0 0' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#624bff' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;