// src/components/Registro.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importamos Link para navegar
import logoBizly from '../assets/logo-bizly.png';
import './Login.css'; // Reutilizamos los estilos del Login

function Registro() {
  // 1. Estados para todos los campos del formulario[cite: 1]
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  
  const navigate = useNavigate();

  // 2. Función que maneja el envío del formulario[cite: 1]
  const registrarUsuario = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Registrando usuario:", { nombre, apellido, correo, password, aceptaTerminos });
    navigate('/dashboard'); // Redirige tras un registro exitoso[cite: 3]
  };

  // 3. Estructura JSX
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-placeholder">
             <img src={logoBizly} alt="Bizly Logo" className="bizly-logo" />
             <h2>Bizly</h2>
          </div>
          <h3>Crear cuenta</h3>
          <p>Regístrate para empezar a usar Bizly</p>
        </div>

        <form onSubmit={registrarUsuario} className="login-form">
          {/* Fila para Nombre y Apellido */}
          <div className="input-row">
            <div className="input-group">
              <label>Nombre <span>*</span></label>
              <input
                type="text"
                placeholder="Juan"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Apellido</label>
              <input
                type="text"
                placeholder="Pérez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Correo electrónico <span>*</span></label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña <span>*</span></label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="helper-text">8 a 72 caracteres, con al menos una letra y un número.</span>
          </div>

          <div className="input-group">
            <label>Confirmar contraseña <span>*</span></label>
            <input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="terminos" 
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              required 
            />
            <label htmlFor="terminos">
              Acepto los <a href="#">términos de uso</a> y la <a href="#">política de privacidad</a>. <span>*</span>
            </label>
          </div>

          <button type="submit" className="btn-submit">
            Crear cuenta
          </button>
        </form>

        <div className="login-footer">
          {/* Usamos Link en lugar de <a> para navegar sin recargar[cite: 3] */}
          <span>¿Ya tienes cuenta?</span> <Link to="/">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default Registro;