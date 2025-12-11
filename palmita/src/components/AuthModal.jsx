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
  const [codigoMaster, setCodigoMaster] = useState('');

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(null);

  // Lógica de Envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const rol = modo === 'master' ? 'master' : (esProfesor ? 'teacher' : 'estudiante');

    try {
      // --- CASO 1: LOGIN ---
      if (modo === 'login' || modo === 'master') {
        const identificador = (rol === 'estudiante' || rol === 'master') ? nombre : email; 
        const usuarioEncontrado = await apiLogin(identificador, password);
        
        if (rol === 'master' && usuarioEncontrado.rol !== 'master') throw new Error("Cuenta no es de Director");
        if (rol === 'teacher' && usuarioEncontrado.rol !== 'teacher') throw new Error("Cuenta no es de Profesor");
        if (rol === 'estudiante' && usuarioEncontrado.rol !== 'estudiante') throw new Error("Credenciales inválidas");

        alAutenticar(usuarioEncontrado);

      } else {
        // --- CASO 2: REGISTRO ---
        const datosNuevoUsuario = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          password,
          edad: rol === 'estudiante' ? Number(edad) : null,
          genero: rol === 'estudiante' ? genero : null,
          rol: rol,
          email: rol === 'teacher' ? email : (rol === 'master' ? 'director@palmita.com' : null), 
          cedula: rol === 'teacher' ? cedula : null,
          codigoMaster: rol === 'master' ? codigoMaster : null
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

  // ESTILOS COMPACTOS (Para que quepa todo)
  const spacingStyle = { marginBottom: '8px', position: 'relative' }; // Reducido de 15px a 8px
  const iconStyle = { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, color: '#888', width: '18px' };
  const inputStyle = { 
    width: '100%', 
    padding: '10px 15px 10px 40px', // Padding reducido ligeramente
    borderRadius: '12px', 
    border: '1px solid #333', 
    background: '#222', 
    color: 'white', 
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const buttonStyle = {
    padding: '8px 15px',
    borderRadius: '10px',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  };

  const getButtonColor = () => {
      if (modo === 'master') return '#FFD700';
      if (esProfesor) return '#0066FF';
      return '#58cc02'; 
  };

  const renderTabs = () => {
    const tabStyle = (tipo) => ({
        flex: 1, 
        background: modo === tipo ? (tipo === 'master' ? '#FFD700' : '#333') : 'transparent', 
        color: modo === tipo ? (tipo === 'master' ? '#111' : 'white') : '#666',
        border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer'
    });

    if (esProfesor) {
      return (
        <div style={{ background: '#1a1a1a', padding: '4px', borderRadius: '12px', marginBottom: '15px', display: 'flex', gap: '4px' }}>
          <button onClick={() => setModo('login')} style={tabStyle('login')}>Ingresar</button>
          <button onClick={() => setModo('registro')} style={tabStyle('registro')}>Registrarse</button>
          <button onClick={() => setModo('master')} style={tabStyle('master')}>Director</button>
        </div>
      );
    }
    return (
      <div style={{ background: '#1a1a1a', padding: '4px', borderRadius: '12px', marginBottom: '15px', display: 'flex', gap: '4px' }}>
        <button onClick={() => setModo('login')} style={tabStyle('login')}>Ingresar</button>
        <button onClick={() => setModo('registro')} style={tabStyle('registro')}>Registrarse</button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="auth-overlay" style={{ background: 'rgba(0,0,0,0.85)' }}>
        <motion.div 
            className="auth-card" 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
                background: '#111', 
                border: '1px solid #333', 
                boxShadow: `0 0 30px ${getButtonColor()}40`, 
                padding: '20px',
                maxHeight: '90vh', // Asegura que no se salga de pantalla
                display: 'flex', 
                flexDirection: 'column'
            }}
        >
          <button className="btn-cerrar-modal" onClick={alCerrar} style={{ color: '#fff', top: '10px', right: '10px' }}>×</button>

          {registroExitoso ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <CheckCircle size={60} color="#58cc02" style={{ margin: '0 auto 15px' }} />
              <h2 style={{color:'white', marginBottom:'10px', fontSize: '20px'}}>¡Cuenta Creada!</h2>
              <button className="btn-auth-submit" onClick={() => { setRegistroExitoso(null); setModo('login'); }} style={{ width: '100%', background: '#58cc02' }}>Ir a Iniciar Sesión</button>
            </div>
          ) : (
            <>
              {/* HEADER COMPACTO */}
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                {modo === 'master' ? (
                    <Crown size={36} color="#FFD700" style={{ margin: '0 auto 5px' }} />
                ) : (
                    esProfesor ? <GraduationCap size={36} color="#0066FF" style={{ margin: '0 auto 5px' }}/> : null
                )}
                <h2 className="auth-titulo" style={{ color: 'white', fontSize: '20px', margin: 0 }}>
                    {modo === 'master' ? 'Acceso Director' : (modo === 'login' ? 'Acceder' : 'Registrarse')}
                </h2>
              </div>

              {error && <div style={{background: 'rgba(255,75,75,0.15)', padding:'8px', borderRadius:'8px', color: '#ff4b4b', textAlign: 'center', marginBottom: '10px', fontSize: '12px', border: '1px solid rgba(255,75,75,0.3)'}}>{error}</div>}

              {renderTabs()}

              {/* FORMULARIO CON SCROLL */}
              <form 
                id="auth-form-main" 
                className="auth-form" 
                onSubmit={handleSubmit}
                style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }} // Scroll si es necesario
              >
                
                {modo === 'master' && (
                    <>
                        <div style={spacingStyle}><User style={iconStyle} /><input type="text" placeholder="Usuario" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ ...inputStyle, borderColor: '#FFD700' }}/></div>
                        <div style={spacingStyle}><Key style={iconStyle} /><input type="password" placeholder="Clave Única" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputStyle, borderColor: '#FFD700' }}/></div>
                    </>
                )}

                {modo !== 'master' && (
                    <>
                        {modo === 'registro' && (
                            <>
                                <div style={spacingStyle}>
                                    <User style={iconStyle} />
                                    <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))} required style={inputStyle} />
                                </div>
                                <div style={spacingStyle}>
                                    <User style={iconStyle}/>
                                    <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))} required style={inputStyle} />
                                </div>
                                
                                {!esProfesor && (
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <input type="number" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} required min="5" style={{...inputStyle, paddingLeft: '10px', textAlign: 'center'}} />
                                        </div>
                                        <div style={{ flex: 1.5, display: 'flex', gap: '4px' }}>
                                            <button type="button" onClick={() => setGenero('niño')} style={{...buttonStyle, flex: 1, background: genero === 'niño' ? '#1e90ff' : '#222', color: genero === 'niño' ? 'white' : '#888'}}>Niño</button>
                                            <button type="button" onClick={() => setGenero('niña')} style={{...buttonStyle, flex: 1, background: genero === 'niña' ? '#ff69b4' : '#222', color: genero === 'niña' ? 'white' : '#888'}}>Niña</button>
                                        </div>
                                    </div>
                                )}
                                
                                {esProfesor && (
                                    <>
                                        <div style={spacingStyle}>
                                            <User style={iconStyle}/>
                                            <input type="text" placeholder="Cédula" value={cedula} onChange={e => setCedula(e.target.value.replace(/[^0-9]/g, ''))} required maxLength={9} style={inputStyle} />
                                        </div>
                                        <div style={spacingStyle}>
                                            <User style={iconStyle}/>
                                            <input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {(!esProfesor && modo === 'login') && ( 
                           <div style={spacingStyle}><User style={iconStyle}/><input type="text" placeholder="Usuario" value={nombre} onChange={e => setNombre(e.target.value)} required style={inputStyle}/></div>
                        )}
                        
                        {(esProfesor && modo === 'login') && (
                            <div style={spacingStyle}><User style={iconStyle}/><input type="text" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}/></div>
                        )}

                        <div style={spacingStyle}>
                            <Lock style={iconStyle}/>
                            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
                        </div>
                    </>
                )}
              </form>

              {/* BOTÓN FIJO AL FINAL */}
              <div style={{ paddingTop: '10px', marginTop: 'auto' }}>
                  <motion.button 
                      form="auth-form-main"
                      whileTap={{ scale: 0.95 }} 
                      whileHover={{ scale: 1.02 }}
                      type="submit" 
                      className="btn-auth-submit" 
                      disabled={cargando}
                      style={{ 
                          backgroundColor: getButtonColor(),
                          color: modo === 'master' ? 'black' : 'white',
                          fontWeight: '800',
                          width: '100%',
                          padding: '12px',
                          borderRadius: '12px',
                          boxShadow: `0 4px 15px ${getButtonColor()}60`,
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '15px'
                      }}
                  >
                      {cargando ? 'Procesando...' : (modo === 'registro' ? 'Crear Cuenta' : 'Entrar')}
                  </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}