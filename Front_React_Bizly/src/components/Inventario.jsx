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

  // Estados para búsqueda y filtros interactivos
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [filtroStock, setFiltroStock] = useState('todos');

  // Estado para guardar lo que el usuario escribe en el formulario
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

  // Petición para cargar el inventario desde el Backend
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

  // Función para capturar lo que se escribe en los inputs del formulario
  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  // Función que se ejecuta al darle clic a "Guardar producto"
  const guardarProducto = async () => {
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
        setModalAbierto(false); 
        setFormulario({ nombre: '', codigo: '', id_categoria: '', precio_venta: '', stock_actual: '' }); 
        cargarInventario(); 
      } else {
        alert("Error al guardar el producto");
      }
    } catch (error) {
      console.error("Error en la petición POST:", error);
    }
  };

  // --- LÓGICA DE FILTRADO INTELIGENTE ---
  const totalProductos = productos.length;
  const stockBajoCount = productos.filter(p => p.stock_actual <= p.stock_minimo).length;

  const productosFiltrados = productos.filter(producto => {
    // 1. Filtro por búsqueda (nombre o SKU)
    const textoMatch = 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.toLowerCase());

    // 2. Filtro por categoría
    const categoriaMatch = 
      categoriaSeleccionada === 'Todas' || producto.id_categoria.toString() === categoriaSeleccionada.toString();

    // 3. Filtro por estado de stock
    let stockMatch = true;
    if (filtroStock === 'bajo') {
      stockMatch = producto.stock_actual <= producto.stock_minimo;
    }

    return textoMatch && categoriaMatch && stockMatch;
  });

  return (
    <div className="admin-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-header">
          <div>
            <div className="breadcrumbs">Bizly / Inventario</div>
            <h1>Inventario</h1>
            <p className="subtitle">{totalProductos} productos · {stockBajoCount} con stock bajo</p>
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

        {/* Alerta interactiva de stock bajo */}
        {stockBajoCount > 0 && (
          <div 
            className="alert-warning" 
            onClick={() => setFiltroStock(filtroStock === 'bajo' ? 'todos' : 'bajo')}
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            title="Haz clic para alternar el filtro de stock bajo"
          >
            ⚠️ {stockBajoCount} producto(s) con stock bajo o agotado. <em>(Haz clic aquí para {filtroStock === 'bajo' ? 'ver todos' : 'filtrarlos'})</em>
          </div>
        )}

        {/* Barra de Acciones y Filtros */}
        <div className="action-bar">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre o SKU..." 
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categoriasDB.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={filtroStock}
            onChange={(e) => setFiltroStock(e.target.value)}
          >
            <option value="todos">Todo el stock</option>
            <option value="bajo">Stock bajo</option>
          </select>
        </div>

        {/* Cuadrícula de Productos Dinámica con alertas visuales de color */}
        <div className="products-grid">
          {cargando ? (
            <p>Cargando inventario...</p>
          ) : productosFiltrados.length === 0 ? (
            <p>No se encontraron productos que coincidan con la búsqueda.</p>
          ) : (
            productosFiltrados.map((producto) => {
              // Determinamos el estado del stock para los colores de alerta visual
              let claseStockCard = '';
              if (producto.stock_actual === 0) {
                claseStockCard = 'card-agotado'; // Estilo rojo
              } else if (producto.stock_actual <= producto.stock_minimo) {
                claseStockCard = 'card-stock-bajo'; // Estilo amarillo
              }

              return (
                <div className={`product-card ${claseStockCard}`} key={producto.id}>
                  <div className="product-image-placeholder">📦</div>
                  <div className="product-info">
                    <h4>{producto.nombre}</h4>
                    <span className="sku">Código: {producto.codigo}</span>
                    <span className="category-tag">Categoría ID: {producto.id_categoria}</span>
                    <div className="product-price-row">
                      <span className="price">$ {producto.precio_venta}</span>
                      <span className={`stock ${producto.stock_actual <= producto.stock_minimo ? 'low-stock' : ''}`}>
                        {producto.stock_actual} {producto.unidad_medida || 'und.'} {producto.stock_actual === 0 ? '(Agotado)' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button className="btn-action">✎ Editar</button>
                    <button className="btn-action danger">🗑 Desactivar</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Modal conectado al estado 'formulario' */}
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
              <button className="btn-primary" onClick={guardarProducto}>Guardar producto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventario;