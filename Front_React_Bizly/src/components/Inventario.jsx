// src/components/Inventario.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import './Dashboard.css'; 
import './Ventas.css'; 
import './Inventario.css'; 

function Inventario() {
  const { usuario } = useContext(AuthContext);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 👇 NUEVO: Estado para guardar lo que el usuario escribe en el formulario
  const [formulario, setFormulario] = useState({
    nombre: '',
    codigo: '',
    id_categoria: '',
    precio_venta: '',
    stock_actual: ''
  });

  // Convertimos las categorías a objetos con su ID real de la BD
  const categoriasDB = [
    { id: 1, nombre: "Abarrotes" },
    { id: 2, nombre: "Lácteos y refrigerados" },
    { id: 3, nombre: "Bebidas" },
    { id: 4, nombre: "Aseo y hogar" },
    { id: 5, nombre: "Cuidado personal" }
  ];

  // Separé la petición en una función para poder reutilizarla
  const cargarInventario = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // 👇 NUEVO: Función para capturar lo que se escribe en los inputs
  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  // 👇 NUEVO: Función que se ejecuta al darle clic a "Guardar producto"
  const guardarProducto = async () => {
    // Mini validación para que no envíen campos vacíos
    if (!formulario.nombre || !formulario.codigo || !formulario.precio_venta || !formulario.stock_actual) {
      alert("Por favor, llena todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulario)
      });

      if (response.ok) {
        alert("¡Producto guardado exitosamente!");
        setModalAbierto(false); // Cerramos el modal
        setFormulario({ nombre: '', codigo: '', id_categoria: '', precio_venta: '', stock_actual: '' }); // Limpiamos formulario
        cargarInventario(); // Recargamos la tabla para que aparezca el nuevo producto al instante
      } else {
        alert("Error al guardar el producto");
      }
    } catch (error) {
      console.error("Error en la petición POST:", error);
    }
  };

  const totalProductos = productos.length;
  const stockBajo = productos.filter(p => p.stock_actual <= p.stock_minimo).length;

  return (
    <div className="admin-container">
      <Sidebar />
      
      {/* ... (Todo el main y el header se queda igualito hasta la parte del Modal) ... */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <div className="breadcrumbs">Bizly / Inventario</div>
            <h1>Inventario</h1>
            <p className="subtitle">{totalProductos} productos · {stockBajo} con stock bajo</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">⭳ Importar CSV</button>
            <button className="btn-primary" onClick={() => setModalAbierto(true)}>
              + Nuevo producto
            </button>
            <div className="header-user" style={{marginLeft: '20px'}}>
              <strong>{usuario?.nombre} {usuario?.apellido}</strong>
            </div>
          </div>
        </header>

        {stockBajo > 0 && (
          <div className="alert-warning">
            ⚠️ {stockBajo} producto(s) con stock bajo o agotado
          </div>
        )}

        <div className="action-bar">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar por nombre o SKU..." className="search-input" />
          </div>
          <select className="filter-select">
            <option>Todas las categorías</option>
            {categoriasDB.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <select className="filter-select">
            <option>Todo el stock</option>
            <option>Stock bajo</option>
          </select>
        </div>

        <div className="products-grid">
          {cargando ? (
            <p>Cargando inventario...</p>
          ) : productos.length === 0 ? (
            <p>No hay productos registrados en la base de datos.</p>
          ) : (
            productos.map((producto) => (
              <div className="product-card" key={producto.id}>
                <div className="product-image-placeholder">📦</div>
                <div className="product-info">
                  <h4>{producto.nombre}</h4>
                  <span className="sku">Código: {producto.codigo}</span>
                  <span className="category-tag">Categoría ID: {producto.id_categoria}</span>
                  <div className="product-price-row">
                    <span className="price">$ {producto.precio_venta}</span>
                    <span className={`stock ${producto.stock_actual <= producto.stock_minimo ? 'low-stock' : ''}`}>
                      {producto.stock_actual} {producto.unidad_medida || 'und.'}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <button className="btn-action">✎ Editar</button>
                  <button className="btn-action danger">🗑 Desactivar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 👇 NUEVO: Modal conectado al estado 'formulario' */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nuevo producto</h2>
              <button className="close-btn" onClick={() => setModalAbierto(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="input-row">
                <div className="input-group">
                  <label>Nombre del producto <span>*</span></label>
                  <input 
                    type="text" 
                    name="nombre" 
                    value={formulario.nombre} 
                    onChange={manejarCambio} 
                    placeholder="Ej. Café Molido 500g" 
                  />
                </div>
                <div className="input-group">
                  <label>SKU (Código) <span>*</span></label>
                  <input 
                    type="text" 
                    name="codigo" 
                    value={formulario.codigo} 
                    onChange={manejarCambio} 
                    placeholder="Ej. ABA-002" 
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label>Categoría <span>*</span></label>
                <select name="id_categoria" value={formulario.id_categoria} onChange={manejarCambio}>
                  <option value="">Seleccione una categoría...</option>
                  {categoriasDB.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Precio de venta ($) <span>*</span></label>
                  <input 
                    type="number" 
                    name="precio_venta" 
                    value={formulario.precio_venta} 
                    onChange={manejarCambio} 
                    placeholder="0" 
                  />
                </div>
                <div className="input-group">
                  <label>Stock inicial <span>*</span></label>
                  <input 
                    type="number" 
                    name="stock_actual" 
                    value={formulario.stock_actual} 
                    onChange={manejarCambio} 
                    placeholder="0" 
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
              {/* Conectamos el botón a nuestra función de guardar */}
              <button className="btn-primary" onClick={guardarProducto}>Guardar producto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventario;