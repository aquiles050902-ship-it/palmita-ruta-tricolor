import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, GraduationCap, CheckCircle, Crown, Key } from 'lucide-react';
import { apiLogin, apiRegistro } from '../services/api';

export default function AuthModal({ alCerrar, alAutenticar, esProfesor = false }) {
  // Estados: 'login', 'registro', 'master'
  const [modo, setModo] = useState('login'); 
  
  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('niño');
  
  // Estado opcional por si se requiere en el futuro
  const [codigoMaster, setCodigoMaster] = useState('');

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(null);

  // Lógica de Envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // --- CASO 1: LOGIN (Estudiantes, Profesores y DIRECTORES) ---
      // Ahora el modo 'master' también usa la lógica de login
      if (modo === 'login' || modo === 'master') {
        
        // Identificador: Para Master/Profe puede ser email o nombre (el input de usuario usa 'nombre')
        const identificador = (esProfesor || modo === 'master') ? (nombre || email) : nombre;
        
        // LOGIN: Usamos apiLogin para verificar credenciales
        const usuarioEncontrado = await apiLogin(identificador, password);
        
        // Validaciones de Rol
        if (modo === 'master') {
            if (usuarioEncontrado.rol !== 'master') throw new Error("Esta cuenta no es de Director");
        } else if (esProfesor) {
            if (usuarioEncontrado.rol !== 'teacher') throw new Error("Esta cuenta no es de Profesor");
        } else {
            if (usuarioEncontrado.rol !== 'estudiante') throw new Error("Credenciales inválidas");
        }

        alAutenticar(usuarioEncontrado);

      } else {
        // --- CASO 2: REGISTRO (Solo para Estudiantes/Profesores) ---
        const datosNuevoUsuario = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          password,
          edad: esProfesor ? null : Number(edad),
          genero: esProfesor ? null : genero,
          rol: esProfesor ? 'teacher' : 'estudiante',
          email: esProfesor ? email : null,
          cedula: esProfesor ? cedula : null,
          codigoMaster: null
        };

        await apiRegistro(datosNuevoUsuario);
        setRegistroExitoso(nombre);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  // Estilos auxiliares
  const spacingStyle = { marginBottom: '15px', position: 'relative' };
  const iconStyle = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '15px', zIndex: 2, color: '#888' };
  const inputStyle = { 
    width: '100%', 
    padding: '12px 15px 12px 45px', 
    borderRadius: '12px', 
    border: '1px solid #333', 
    background: '#222', 
    color: 'white', 
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  // Color dinámico del botón
  const getButtonColor = () => {
      if (modo === 'master') return '#FFD700'; // Dorado para Director
      if (esProfesor) return '#0066FF'; // Azul para Profesor
      return '#58cc02'; // Verde para Estudiante
  };

  return (
    <AnimatePresence>
      <div className="auth-overlay" style={{ background: 'rgba(0,0,0,0.85)' }}>
        <motion.div 
            className="auth-card" 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            style={{ background: '#111', border: '1px solid #333', boxShadow: `0 0 30px ${getButtonColor()}40`, padding: '25px' }}
        >
          <button className="btn-cerrar-modal" onClick={alCerrar} style={{ color: '#fff' }}>×</button>

          {registroExitoso ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <CheckCircle size={80} color="#58cc02" style={{ margin: '0 auto 20px' }} />
              <h2 style={{color:'white', marginBottom:'10px'}}>¡Cuenta Creada!</h2>
              <button className="btn-auth-submit" onClick={() => { setRegistroExitoso(null); setModo('login'); }} style={{ width: '100%', background: '#58cc02' }}>Ir a Iniciar Sesión</button>
            </div>
          ) : (
            <>
              {/* HEADER CON ICONO */}
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                {modo === 'master' ? (
                    <Crown size={48} color="#FFD700" style={{ margin: '0 auto 10px', filter: 'drop-shadow(0 0 10px #FFD700)' }} />
                ) : (
                    esProfesor ? 
                    <GraduationCap size={48} color="#0066FF" style={{ margin: '0 auto 10px' }}/> : 
                    null
                )}
                <h2 className="auth-titulo" style={{ color: 'white', fontSize: '24px' }}>
                    {modo === 'master' ? 'Acceso Director' : (modo === 'login' ? 'Acceder' : 'Registrarse')}
                </h2>
              </div>

              {error && <div style={{background: 'rgba(255,75,75,0.15)', padding:'12px', borderRadius:'10px', color: '#ff4b4b', textAlign: 'center', marginBottom: '20px', fontSize: '13px', border: '1px solid rgba(255,75,75,0.3)'}}>{error}</div>}

              {/* PESTAÑAS DE NAVEGACIÓN */}
              <div className="auth-tabs" style={{ background: '#1a1a1a', padding: '5px', borderRadius: '15px', marginBottom: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                <button 
                    className={`auth-tab ${modo === 'login' ? 'activo' : ''}`} 
                    onClick={() => setModo('login')}
                    style={{ color: modo === 'login' ? 'white' : '#666' }}
                >
                    Ingresar
                </button>
                <button 
                    className={`auth-tab ${modo === 'registro' ? 'activo' : ''}`} 
                    onClick={() => setModo('registro')}
                    style={{ color: modo === 'registro' ? 'white' : '#666' }}
                >
                    Registrarse
                </button>
                <button 
                    className={`auth-tab ${modo === 'master' ? 'activo' : ''}`} 
                    onClick={() => setModo('master')}
                    style={{ color: modo === 'master' ? '#111' : '#888', background: modo === 'master' ? '#FFD700' : 'transparent', fontWeight: 'bold' }}
                >
                    Director
                </button>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                
                {/* --- VISTA DIRECTOR (SOLO USUARIO Y CLAVE ÚNICA) --- */}
                {modo === 'master' && (
                    <>
                        <div className="input-group" style={spacingStyle}>
                            <User size={20} style={iconStyle} />
                            <input 
                                type="text" 
                                placeholder="Usuario" 
                                value={nombre} 
                                onChange={e => setNombre(e.target.value)} 
                                required 
                                style={{ ...inputStyle, borderColor: '#FFD700' }}
                            />
                        </div>
                        <div className="input-group" style={spacingStyle}>
                            <Key size={20} style={iconStyle} />
                            <input 
                                type="password" 
                                placeholder="Clave Única" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                style={{ ...inputStyle, borderColor: '#FFD700' }}
                            />
                        </div>
                    </>
                )}

                {/* --- VISTA NORMAL (LOGIN / REGISTRO) --- */}
                {modo !== 'master' && (
                    <>
                        {/* CAMPOS SOLO PARA REGISTRO */}
                        {modo === 'registro' && (
                            <>
                                <div className="input-group" style={spacingStyle}>
                                    <User size={20} style={iconStyle} />
                                    <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required style={inputStyle} />
                                </div>
                                <div className="input-group" style={spacingStyle}>
                                    <User size={20} style={iconStyle}/>
                                    <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} required style={inputStyle} />
                                </div>
                                {!esProfesor && (
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                                            <input type="number" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} required min="5" style={{...inputStyle, paddingLeft: '15px'}} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: '#222', borderRadius: '12px', border: '1px solid #333' }}>
                                            <label style={{cursor:'pointer', fontSize:'12px', color:'#aaa'}}><input type="radio" checked={genero==='niño'} onChange={()=>setGenero('niño')}/> 👦</label>
                                            <label style={{cursor:'pointer', fontSize:'12px', color:'#aaa'}}><input type="radio" checked={genero==='niña'} onChange={()=>setGenero('niña')}/> 👧</label>
                                        </div>
                                    </div>
                                )}
                                {esProfesor && (
                                    <div className="input-group" style={spacingStyle}>
                                        <User size={20} style={iconStyle}/>
                                        <input type="text" placeholder="Cédula" value={cedula} onChange={e => setCedula(e.target.value)} required style={inputStyle} />
                                    </div>
                                )}
                            </>
                        )}

                        {/* CAMPOS COMUNES LOGIN/REGISTRO */}
                        <div className="input-group" style={spacingStyle}>
                            <User size={20} style={iconStyle}/>
                            <input 
                                type={modo === 'login' && !esProfesor ? "text" : "email"} 
                                placeholder={modo === 'login' && !esProfesor ? "Usuario" : "Correo Electrónico"} 
                                value={modo === 'login' && !esProfesor ? nombre : email} 
                                onChange={e => (modo === 'login' && !esProfesor) ? setNombre(e.target.value) : setEmail(e.target.value)} 
                                required 
                                style={inputStyle}
                            />
                        </div>

                        <div className="input-group" style={spacingStyle}>
                            <Lock size={20} style={iconStyle}/>
                            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
                        </div>
                    </>
                )}

                <motion.button 
                    whileTap={{ scale: 0.95 }} 
                    whileHover={{ scale: 1.02 }}
                    type="submit" 
                    className="btn-auth-submit" 
                    disabled={cargando}
                    style={{ 
                        backgroundColor: getButtonColor(),
                        color: modo === 'master' ? 'black' : 'white',
                        fontWeight: '800',
                        marginTop: '10px',
                        padding: '14px',
                        borderRadius: '12px',
                        boxShadow: `0 4px 15px ${getButtonColor()}60`
                    }}
                >
                    {cargando ? 'Procesando...' : (modo === 'registro' ? 'Crear Cuenta' : 'Entrar')}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}