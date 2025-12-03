import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, GraduationCap, CheckCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'palmita_demo_users';

const getLocalUsers = () => {
  const users = localStorage.getItem(LOCAL_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

export default function AuthModal({ alCerrar, alAutenticar, esProfesor = false }) {
  const [esLogin, setEsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [genero, setGenero] = useState('niño');

  const [registroExitoso, setRegistroExitoso] = useState(null);

  const validarEmailGmail = (value) => /@gmail\.com$/i.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Flujo docente (local, sin backend):
    if (esProfesor) {
      if (esLogin) {
        if (!email || !password) {
          setError('Ingresa tu correo y contraseña.');
          return;
        }
        if (!validarEmailGmail(email)) {
          setError('El correo debe ser de Gmail.');
          return;
        }
        // Demo: credenciales fijas admin
        if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin123') {
          alAutenticar({ nombre: 'Profesor', rol: 'admin', email });
        } else {
          setError('Credenciales inválidas.');
        }
        return;
      }

      // Registro docente (localStorage de demo)
      if (!email || !password || !nombre || !apellido || !edad || !cedula) {
        setError('Completa todos los campos.');
        return;
      }
      if (!validarEmailGmail(email)) {
        setError('El correo debe ser de Gmail.');
        return;
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      if (Number(edad) < 18 || Number(edad) > 80) {
        setError('La edad debe estar entre 18 y 80 años.');
        return;
      }

      const users = getLocalUsers();
      if (users.some(u => u.email?.toLowerCase() === email.toLowerCase())) {
        setError('Ya existe un usuario con ese correo.');
        return;
      }
      if (users.some(u => u.cedula === cedula)) {
        setError('Ya existe un usuario con esa cédula.');
        return;
      }

      const nuevoDocente = {
        rol: 'teacher',
        email,
        password, // En demo se guarda en claro; en backend real usar hash
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: Number(edad),
        cedula: cedula.trim(),
        creadoEn: Date.now()
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...users, nuevoDocente]));
      setRegistroExitoso(`${nombre} ${apellido}`);
      return;
    }

    // Lógica de estudiante existente
    const nombreCompleto = `${nombre.trim()} ${apellido.trim()}`.trim();
    const nombreBusqueda = nombre.trim().toLowerCase();
    const users = getLocalUsers();

    if (esLogin) {
      if (!nombre || !password) {
        setError('Por favor, ingresa tu Nombre y Contraseña.');
        return;
      }
      const userFound = users.find(u => u.nombre?.toLowerCase().includes(nombreBusqueda));

      if (userFound && userFound.password === password) {
        alAutenticar(userFound);
      } else if (userFound && userFound.password !== password) {
        setError('Contraseña incorrecta.');
      } else {
        setError(`No existe el estudiante "${nombre}". Regístrate primero.`);
      }
    } else {
      if (!nombre || !apellido || !edad || !password) {
        setError('Completa todos los campos.');
        return;
      }
      if (!['niño','niña'].includes(genero)) {
        setError('Selecciona si eres niño o niña.');
        return;
      }
      if (password.length < 4) {
        setError('La contraseña es muy corta.');
        return;
      }
      if (users.some(u => u.nombre?.toLowerCase() === nombreCompleto.toLowerCase())) {
        setError(`Ya existe ${nombreCompleto}. Usa otro nombre.`);
        return;
      }

      const newUser = {
        nombre: nombreCompleto,
        apellido: apellido.trim(),
        password: password,
        edad: edad,
        genero: genero,
        rol: 'estudiante',
        gemas: 0,
        nivel: 1,
        racha: 0,
        progresoNiveles: []
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...users, newUser]));
      setRegistroExitoso(nombre);
    }
  };

  const irAIniciarSesion = () => {
    setRegistroExitoso(null);
    setEsLogin(true);
    setPassword('');
  };

  return (
    <AnimatePresence>
      <div className="auth-overlay">
        <motion.div
          className="auth-card"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <button
            className="btn-cerrar-modal"
            onClick={alCerrar}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '28px',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            ×
          </button>

          {registroExitoso ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
              >
                <CheckCircle size={80} color="#58cc02" strokeWidth={2} />
              </motion.div>

              <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '10px' }}>¡Bienvenido/a!</h2>
              <h3 style={{ color: '#58cc02', fontSize: '24px', marginBottom: '20px', textTransform: 'capitalize' }}>
                {registroExitoso}
              </h3>
              <p style={{ color: '#aaa', marginBottom: '30px' }}>
                Tu cuenta ha sido creada correctamente. Ahora inicia sesión para continuar.
              </p>

              <button className="btn-auth-submit" onClick={irAIniciarSesion} style={{ width: '100%' }}>
                Ir a Iniciar Sesión
              </button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {esProfesor ? (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <div style={{ background: '#0066FF', padding: '15px', borderRadius: '50%' }}>
                      <GraduationCap size={40} color="white" />
                    </div>
                  </div>
                ) : null}
                <h2 className="auth-titulo">
                  {esProfesor ? (esLogin ? 'Acceso Docente' : 'Registro Docente') : esLogin ? 'Hola, ¿Cómo te llamas?' : 'Crea tu Usuario'}
                </h2>
              </div>

              {error && (
                <p
                  style={{
                    color: '#ff4b4b',
                    textAlign: 'center',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    background: 'rgba(255,0,0,0.1)',
                    padding: '10px',
                    borderRadius: '8px'
                  }}
                >
                  {error}
                </p>
              )}

              <div className="auth-tabs">
                {esProfesor ? (
                  <>
                    <button className={`auth-tab ${esLogin ? 'activo' : ''}`} onClick={() => { setEsLogin(true); setError(''); }}>Ingresar</button>
                    <button className={`auth-tab ${!esLogin ? 'activo' : ''}`} onClick={() => { setEsLogin(false); setError(''); }}>Registrarse</button>
                  </>
                ) : (
                  <>
                    <button className={`auth-tab ${esLogin ? 'activo' : ''}`} onClick={() => { setEsLogin(true); setError(''); }}>Ingresar</button>
                    <button className={`auth-tab ${!esLogin ? 'activo' : ''}`} onClick={() => { setEsLogin(false); setError(''); }}>Registrarse</button>
                  </>
                )}
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {esProfesor ? (
                  <>
                    {!esLogin && (
                      <>
                        <div className="input-group">
                          <User size={20} className="input-icon" />
                          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="input-group">
                          <User size={20} className="input-icon" />
                          <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                        </div>
                        <div className="input-group">
                          <User size={20} className="input-icon" />
                          <input type="text" placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} required />
                        </div>
                        <div className="input-group">
                          <Lock size={20} className="input-icon" />
                          <input type="number" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} required min="18" max="80" />
                        </div>
                      </>
                    )}

                    <div className="input-group">
                      <User size={20} className="input-icon" />
                      <input type="email" placeholder="Correo Gmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="input-group">
                      <Lock size={20} className="input-icon" />
                      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-auth-submit" style={{ background: 'linear-gradient(to bottom, #0066FF, #0044AA)', boxShadow: '0 4px 0 #003388' }}>
                      {esLogin ? 'Entrar al Panel' : 'Crear Cuenta Docente'}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <div className="input-group">
                      <User size={20} className="input-icon" />
                      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    {!esLogin && (
                      <>
                        <div className="auth-tabs" style={{ marginTop: 4 }}>
                          <button
                            type="button"
                            className={`auth-tab tab-azul ${genero === 'niño' ? 'activo' : ''}`}
                            onClick={() => setGenero('niño')}
                          >
                            Niño
                          </button>
                          <button
                            type="button"
                            className={`auth-tab tab-rosa ${genero === 'niña' ? 'activo' : ''}`}
                            onClick={() => setGenero('niña')}
                          >
                            Niña
                          </button>
                        </div>
                        <div className="input-group">
                          <User size={20} className="input-icon" />
                          <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                        </div>
                        <div className="input-group">
                          <Lock size={20} className="input-icon" />
                          <input type="number" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} required min="6" max="18" />
                        </div>
                      </>
                    )}

                    <div className="input-group">
                      <Lock size={20} className="input-icon" />
                      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-auth-submit">
                      {esLogin ? 'Ingresar' : 'Crear Cuenta'}
                    </motion.button>
                  </>
                )}
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}