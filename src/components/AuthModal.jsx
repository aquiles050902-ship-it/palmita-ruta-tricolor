import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, GraduationCap, CheckCircle } from 'lucide-react';
import { apiLogin, apiRegistro } from '../services/api';

export default function AuthModal({ alCerrar, alAutenticar, esProfesor = false }) {
  const [esLogin, setEsLogin] = useState(true);
  
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('niño');

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(null);

  const validarEmailGmail = (val) => /@gmail\.com$/i.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (esLogin) {
        // --- LOGIN ---
        const identificador = esProfesor ? email : nombre;
        const usuarioEncontrado = await apiLogin(identificador, password);
        
        if (esProfesor && usuarioEncontrado.rol !== 'teacher') throw new Error("Esta cuenta no es de profesor");
        if (!esProfesor && usuarioEncontrado.rol !== 'estudiante') throw new Error("Esta cuenta no es de estudiante");

        alAutenticar(usuarioEncontrado);

      } else {
        // --- REGISTRO ---
        if (!password) throw new Error("La contraseña es obligatoria");
        
        if (!esProfesor) {
            // Validaciones solo para estudiantes
            if (password.length > 8) throw new Error("La contraseña debe tener máximo 8 caracteres");
            if (password.length < 3) throw new Error("La contraseña es muy corta");
            if (!edad) throw new Error("La edad es obligatoria para estudiantes");
        }

        if (esProfesor) {
            // Validaciones solo para profesores
            if (!validarEmailGmail(email)) throw new Error("El correo debe ser Gmail");
            if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        const datosNuevoUsuario = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          password,
          // CAMBIO 2: Si es profesor, la edad es null, si es estudiante, se convierte a número
          edad: esProfesor ? null : Number(edad),
          genero: esProfesor ? null : genero,
          rol: esProfesor ? 'teacher' : 'estudiante',
          email: esProfesor ? email : null,
          cedula: esProfesor ? cedula : null
        };

        await apiRegistro(datosNuevoUsuario);
        setRegistroExitoso(nombre);
      }
    } catch (err) {
      console.error(err);
      if (err.message === "Failed to fetch") {
        setError("Error: No hay conexión con el servidor.");
      } else {
        setError(err.message || "Error desconocido");
      }
    } finally {
      setCargando(false);
    }
  };

  const irAIniciarSesion = () => {
    setRegistroExitoso(null);
    setEsLogin(true);
    setPassword('');
  };

  const spacingStyle = { marginBottom: '10px', position: 'relative' };
  const iconStyle = { 
      position: 'absolute',
      top: '50%', 
      transform: 'translateY(-50%)', 
      left: '12px',
      zIndex: 2,
      color: '#aaa'
  };

  return (
    <AnimatePresence>
      <div className="auth-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
        <motion.div 
            className="auth-card" 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ 
                padding: '25px', 
                maxWidth: '380px', 
                width: '100%',
                maxHeight: '95vh', 
                overflowY: 'auto'
            }} 
        >
          <button className="btn-cerrar-modal" onClick={alCerrar} style={{position: 'absolute', top: 12, right: 12, fontSize: '18px'}}>×</button>

          {registroExitoso ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={80} color="#58cc02" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ color: 'white', marginBottom: '10px' }}>¡Listo!</h2>
              <p style={{ color: '#aaa', marginBottom: '20px' }}>Cuenta creada exitosamente.</p>
              <button className="btn-auth-submit" onClick={irAIniciarSesion} style={{ width: '100%' }}>Iniciar Sesión</button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                {esProfesor && <GraduationCap size={32} color="#0066FF" style={{ margin: '0 auto 5px' }} />}
                <h2 className="auth-titulo" style={{ fontSize: '22px', marginBottom: '2px' }}>{esLogin ? 'Acceder' : 'Crear Cuenta'}</h2>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{esProfesor ? 'Portal Docente' : 'Zona de Estudiantes'}</p>
              </div>

              {error && <p style={{ background: 'rgba(255, 75, 75, 0.2)', color: '#ff4b4b', padding: '8px', borderRadius: '8px', textAlign: 'center', fontSize: '12px', marginBottom: '15px' }}>{error}</p>}

              <div className="auth-tabs" style={{ marginBottom: '15px' }}>
                <button className={`auth-tab ${esLogin ? 'activo' : ''}`} onClick={() => setEsLogin(true)} style={{ padding: '8px' }}>Ingresar</button>
                <button className={`auth-tab ${!esLogin ? 'activo' : ''}`} onClick={() => setEsLogin(false)} style={{ padding: '8px' }}>Registrarse</button>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {/* CAMPOS DE REGISTRO */}
                {!esLogin && (
                  <>
                    <div className="input-group" style={spacingStyle}>
                        <User size={18} style={iconStyle} />
                        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ padding: '10px 10px 10px 40px', fontSize: '14px' }} />
                    </div>
                    
                    <div className="input-group" style={spacingStyle}>
                        <User size={18} style={iconStyle}/>
                        <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} required style={{ padding: '10px 10px 10px 40px', fontSize: '14px' }}/>
                    </div>

                    {esProfesor ? (
                        <div className="input-group" style={spacingStyle}>
                            {/* Icono de Cédula/ID */}
                            <User size={18} style={iconStyle}/>
                            <input type="text" placeholder="Cédula" value={cedula} onChange={e => setCedula(e.target.value)} required style={{ padding: '10px 10px 10px 40px', fontSize: '14px' }}/>
                        </div>
                    ) : (
                        // Bloque solo para estudiantes: Género y Edad
                        <>
                            <div className="auth-tabs" style={{ marginTop: '5px', marginBottom: '10px', gap: '5px' }}>
                                <button type="button" className={`auth-tab tab-azul ${genero === 'niño' ? 'activo' : ''}`} onClick={() => setGenero('niño')} style={{ padding: '8px', fontSize: '12px' }}>Niño</button>
                                <button type="button" className={`auth-tab tab-rosa ${genero === 'niña' ? 'activo' : ''}`} onClick={() => setGenero('niña')} style={{ padding: '8px', fontSize: '12px' }}>Niña</button>
                            </div>
                            
                            {/* CAMBIO 1: El campo EDAD solo se muestra si NO es profesor */}
                            <div className="input-group" style={spacingStyle}>
                                <User size={18} style={iconStyle}/>
                                <input type="number" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} required min={5} style={{ padding: '10px 10px 10px 40px', fontSize: '14px' }}/>
                            </div>
                        </>
                    )}
                  </>
                )}

                {/* CAMPO DE USUARIO (Email para profe, Nombre para login niño) */}
                {(esProfesor || esLogin) && (
                    <div className="input-group" style={spacingStyle}>
                        <User size={18} style={iconStyle}/>
                        {esProfesor ? (
                            <input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px 10px 10px 40px', fontSize: '14px' }}/>
                        ) : (
                            <input type="text" placeholder="Tu Nombre de Usuario" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ padding: '10px 10px 10px 40px', fontSize: '14px' }}/>
                        )}
                    </div>
                )}

                <div className="input-group" style={spacingStyle}>
                    <Lock size={18} style={iconStyle}/>
                    <input 
                        type="password" 
                        placeholder={esProfesor ? "Contraseña" : "Contraseña (máx 8)"} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        maxLength={esProfesor ? 50 : 8}
                        style={{ padding: '10px 10px 10px 40px', fontSize: '14px' }}
                    />
                </div>

                {/* CAMBIO 3: Botón azul si es profesor */}
                <motion.button 
                    whileTap={{ scale: 0.95 }} 
                    type="submit" 
                    className="btn-auth-submit" 
                    disabled={cargando} 
                    style={{ 
                        opacity: cargando ? 0.7 : 1, 
                        marginTop: '5px', 
                        padding: '12px',
                        // Si es profesor, forzamos el color azul. Si no, usa el estilo por defecto (verde/naranja)
                        backgroundColor: esProfesor ? '#0066FF' : undefined,
                        color: 'white' // Aseguramos texto blanco
                    }}
                >
                    {cargando ? 'Conectando...' : (esLogin ? 'Entrar' : 'Registrarse')}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}