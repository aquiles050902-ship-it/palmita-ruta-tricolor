import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'palmita_demo_users'; 

const getLocalUsers = () => {
  const users = localStorage.getItem(LOCAL_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

export default function AuthModal({ alCerrar, alAutenticar }) {
  const [esLogin, setEsLogin] = useState(true); 
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const nombreCompleto = `${nombre.trim()} ${apellido.trim()}`.trim();
    const nombreBusqueda = nombre.trim().toLowerCase();
    const users = getLocalUsers();

    if (esLogin) {
      // LÓGICA DE INICIO DE SESIÓN SIMULADA
      if (!nombre || !password) {
        setError('Por favor, ingresa tu Nombre y Contraseña.');
        return;
      }
      
      const userFound = users.find(u => u.nombre.toLowerCase().includes(nombreBusqueda));

      if (userFound && userFound.password === password) {
        alAutenticar(userFound); 
      } else if (userFound && userFound.password !== password) {
        setError('Contraseña incorrecta. Inténtalo de nuevo.');
      } else {
        setError(`No se encontró un estudiante llamado "${nombre}". Regístrate.`);
      }

    } else {
      // LÓGICA DE REGISTRO SIMULADA
      if (!nombre || !apellido || !edad || !password) {
        setError('Debes completar todos los campos.');
        return;
      }
      
      if (password.length < 4 || password.length > 8) {
         setError('La contraseña debe tener entre 4 y 8 caracteres.');
         return;
      }

      if (users.some(u => u.nombre.toLowerCase() === nombreCompleto.toLowerCase())) {
          setError(`Ya existe un usuario llamado ${nombreCompleto}. Usa un apodo.`);
          return;
      }

      const newUser = { 
          nombre: nombreCompleto, 
          apellido: apellido.trim(),
          password: password, 
          edad: edad, 
          rol: 'estudiante',
          gemas: 0,
          nivel: 1,
          racha: 0
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...users, newUser]));
      
      alert(`¡${nombre}, tu cuenta ha sido creada y guardada! Ahora inicia sesión.`);
      setEsLogin(true); // Redirigir a login después de registrarse
    }
  };

  return (
    <AnimatePresence>
      <div className="auth-overlay">
        <motion.div 
          className="auth-card"
          initial={{ scale: 0.8, opacity: 0, y: 50 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }}    
          exit={{ scale: 0.8, opacity: 0, y: 50 }}      
          transition={{ duration: 0.3, ease: "easeOut" }} 
        >
          <button className="btn-cerrar-modal" onClick={alCerrar}>
            <X size={24} />
          </button>

          <h2 className="auth-titulo">{esLogin ? 'Hola, ¿Cómo te llamas?' : 'Crea tu Usuario'}</h2>

          {error && <p style={{color: '#ff4b4b', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold'}}>{error}</p>}

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${esLogin ? 'activo' : ''}`}
              onClick={() => { setEsLogin(true); setError(''); }}
            >
              Ingresar
            </button>
            <button 
              className={`auth-tab ${!esLogin ? 'activo' : ''}`}
              onClick={() => { setEsLogin(false); setError(''); }}
            >
              Registrarse
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Campo Nombre (Identificador principal) */}
            <div className="input-group">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="Nombre (o Nombre y Apellido para Login)" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
              />
            </div>
            
            {/* Campos adicionales para el REGISTRO */}
            {!esLogin && (
              <>
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Apellido" 
                    value={apellido} 
                    onChange={(e) => setApellido(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input 
                    type="number" 
                    placeholder="Edad (6-12 años)" 
                    value={edad} 
                    onChange={(e) => setEdad(e.target.value)} 
                    required 
                    min="6"
                    max="12"
                  />
                </div>
              </>
            )}

            {/* Campo Contraseña */}
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input 
                type="password" 
                placeholder={esLogin ? "Contraseña" : "Contraseña (4-8 caracteres)"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                maxLength={8}
                minLength={4}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn-auth-submit"
            >
              {esLogin ? 'Ingresar' : 'Crear Cuenta'}
            </motion.button>
          </form>

          <p className="auth-footer">
            {esLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} 
            <span onClick={() => { setEsLogin(!esLogin); setError(''); }}>
              {esLogin ? 'Regístrate aquí' : 'Ingresar'}
            </span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}