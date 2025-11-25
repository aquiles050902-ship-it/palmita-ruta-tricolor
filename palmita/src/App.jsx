import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import './App.css';

// Componentes
import HeaderBar from './components/HeaderBar';
import SideMenu from './components/SideMenu';
import QuizEngine from './components/QuizEngine';
import AuthModal from './components/AuthModal';
import TrophyRoom from './components/TrophyRoom';
import PalmitaCare from './components/PalmitaCare';
import UserProfile from './components/UserProfile';
import TeacherDashboard from './components/TeacherDashboard';
import PalmitaMascot from './components/PalmitaMascot'; 
import MatrixParticles from './components/MatrixParticles'; 

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [visitanteAntiguo, setVisitanteAntiguo] = useState(false);
  
  const [vistaActual, setVistaActual] = useState('bienvenida'); 
  const [mostrarLogin, setMostrarLogin] = useState(false); 
  const [usuario, setUsuario] = useState(null); 

  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem('rt_hasVisited') === '1';
      setVisitanteAntiguo(hasVisited);
      if (!hasVisited) localStorage.setItem('rt_hasVisited', '1');
    } catch (_) { }
  }, []);

  const handleLoginExitoso = (datosUsuario) => {
    setUsuario(datosUsuario);
    setMostrarLogin(false);
    setVistaActual('mapa'); // Al entrar, vamos al mapa
  };

  const entrarComoProfesor = () => {
    const password = prompt("🔒 Ingrese la clave de docente:");
    if (password === "admin123") {
      setVistaActual('dashboard_profe');
    } else if (password !== null) {
      alert("Clave incorrecta");
    }
  };

  const mostrarNavegacion = vistaActual !== 'bienvenida' && vistaActual !== 'dashboard_profe' && vistaActual !== 'quiz';

  return (
    <div className="app-duolingo">
      
      {mostrarNavegacion && (
        <HeaderBar setMenuAbierto={setMenuAbierto} />
      )}
      
      <div className={`overlay ${menuAbierto ? 'visible' : ''}`} onClick={() => setMenuAbierto(false)} />
      
      {mostrarNavegacion && (
        <SideMenu 
          menuAbierto={menuAbierto} 
          setMenuAbierto={setMenuAbierto} 
          setVistaActual={setVistaActual}
          vistaActual={vistaActual}
        />
      )}

      <main className={`contenido-principal 
          ${vistaActual === 'quiz' ? 'modo-quiz' : ''} 
          ${vistaActual === 'dashboard_profe' ? 'modo-profe' : ''}
          ${vistaActual === 'bienvenida' ? 'full-width' : ''} 
      `}>
        
        {/* VISTA 1: BIENVENIDA */}
        {vistaActual === 'bienvenida' && (
          <>
            <MatrixParticles />

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="tarjeta-central"
              style={{ zIndex: 10, position: 'relative' }} 
            >
              <div style={{ marginBottom: '20px' }}>
                 <PalmitaMascot width={220} />
              </div>

              <h2 className="bienvenida">¡Bienvenido!</h2>
              <p className="mensaje">
                  ¿Listo para <span style={{ color: '#39FF14', fontWeight: 'bold', textShadow: '0 0 8px #39FF14' }}>aprender la lógica de programación</span>?
              </p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="boton-empezar"
                onClick={() => setMostrarLogin(true)}
              >
                EMPEZAR
              </motion.button>

              <motion.button 
                 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                 className="boton-ingresar"
                 onClick={entrarComoProfesor}
              >
                INGRESAR COMO PROFESOR
              </motion.button>
            </motion.div>
          </>
        )}

        {/* VISTA 2: MAPA DE AVENTURA (Ruta Vertical Ordenada) */}
        {vistaActual === 'mapa' && (
          <motion.div 
            className="pantalla-interior mapa-aventura-container" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <h2 className="titulo-seccion">TU AVENTURA DE PROGRAMACIÓN</h2>
            
            <div className="mapa-islas">
              
              {/* NODO 1: Fundamentos (Activo) */}
              <motion.div 
                className="isla-nivel nivel-activo centrado" 
                whileHover={{ scale: 1.1, zIndex: 2 }}
                onClick={() => setVistaActual('quiz')}
              >
                <div className="icono-isla activa"><span role="img" aria-label="estrella">⭐</span></div>
                <h3 className="etiqueta-nivel">Fundamentos</h3>
              </motion.div>

              {/* NODO 2: Secuencias (Activo) */}
              <motion.div 
                className="isla-nivel nivel-activo centrado" 
                whileHover={{ scale: 1.1, zIndex: 2 }}
                onClick={() => setVistaActual('quiz')}
              >
                <div className="icono-isla activa"><span role="img" aria-label="play">▶️</span></div>
                <h3 className="etiqueta-nivel">Secuencias</h3>
              </motion.div>

              {/* NODO 3: Patrones (Bloqueado) */}
              <motion.div 
                className="isla-nivel bloqueada centrado" 
                whileHover={{ scale: 1.05, zIndex: 2 }}
              >
                <div className="icono-isla bloqueado"><span role="img" aria-label="candado">🔒</span></div>
                <h3 className="etiqueta-nivel">Patrones</h3>
              </motion.div>

              {/* NODO 4: Bucles (Bloqueado) */}
              <motion.div 
                className="isla-nivel bloqueada centrado" 
                whileHover={{ scale: 1.05, zIndex: 2 }}
              >
                <div className="icono-isla bloqueado"><span role="img" aria-label="candado">🔒</span></div>
                <h3 className="etiqueta-nivel">Bucles</h3>
              </motion.div>

              {/* NODO 5: Condicionales (Bloqueado) */}
              <motion.div 
                className="isla-nivel bloqueada centrado" 
                whileHover={{ scale: 1.05, zIndex: 2 }}
              >
                <div className="icono-isla bloqueado"><span role="img" aria-label="candado">🔒</span></div>
                <h3 className="etiqueta-nivel">Condicionales</h3>
              </motion.div>
              
              {/* Añadir espacio para el scroll final */}
              <div style={{ height: '50px' }} /> 

            </div>
          </motion.div>
        )}

        {/* VISTA 3: QUIZ (JUEGO) */}
        {vistaActual === 'quiz' && (
          <QuizEngine alCerrar={() => setVistaActual('mapa')} alCompletar={() => setVistaActual('mapa')} />
        )}

        {/* VISTAS EXTRAS: LOGROS, MASCOTA, PERFIL */}
        {vistaActual === 'logros' && <TrophyRoom />}
        {vistaActual === 'mascota' && <PalmitaCare />}
        {vistaActual === 'perfil' && <UserProfile usuario={usuario} />}

        {/* VISTA PROFESOR */}
        {vistaActual === 'dashboard_profe' && <TeacherDashboard alSalir={() => setVistaActual('bienvenida')} />}

        {/* MODAL LOGIN */}
        {mostrarLogin && <AuthModal alCerrar={() => setMostrarLogin(false)} alAutenticar={handleLoginExitoso} />}

      </main>
    </div>
  );
}

export default App;