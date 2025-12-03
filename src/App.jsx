import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import './App.css';

// Audio
import audio from './utils/audio';

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
  // Estados de Interfaz
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuAmpliado, setMenuAmpliado] = useState(true);
  const [vistaActual, setVistaActual] = useState('bienvenida'); 
  const [mostrarLogin, setMostrarLogin] = useState(false); 
  const [mostrarLoginProfe, setMostrarLoginProfe] = useState(false);

  // Estados de Datos
  const [usuario, setUsuario] = useState(null); 
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);

  // Niveles
  const [niveles, setNiveles] = useState([
    { id: 1, nombre: 'La Receta', estado: 'actual' },
    { id: 2, nombre: 'El Laberinto', estado: 'bloqueado' },
    { id: 3, nombre: 'Patrones', estado: 'bloqueado' },
    { id: 4, nombre: 'Detecta el Error', estado: 'bloqueado' },
    { id: 5, nombre: 'Semáforo', estado: 'bloqueado' },
    { id: 6, nombre: 'Condicionales', estado: 'bloqueado' },
    { id: 7, nombre: 'Repeticiones', estado: 'bloqueado' },
    { id: 8, nombre: 'Tipos de Datos', estado: 'bloqueado' },
    { id: 9, nombre: 'Lógica Pura', estado: 'bloqueado' },
    { id: 10, nombre: 'Soy Programador', estado: 'bloqueado' },
  ]);

  useEffect(() => {
    try {
      if (!localStorage.getItem('rt_hasVisited')) {
        localStorage.setItem('rt_hasVisited', '1');
      }
    } catch (_) { }
    // Inicializa audio tras primer gesto del usuario
    audio.initOnUserGesture();
  }, []);

  // --- TEMA (claro/oscuro) ---
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
    } catch (_) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // --- LOGINS ---
  const handleLoginExitoso = (datosUsuario) => {
    setUsuario(datosUsuario); // Cargamos al usuario
    
    // Restauramos su progreso visual en el mapa
    if (datosUsuario.progresoNiveles) {
        const nuevosNiveles = niveles.map(n => {
            if (datosUsuario.progresoNiveles.includes(n.id)) return { ...n, estado: 'completado' };
            const maxCompletado = Math.max(0, ...datosUsuario.progresoNiveles);
            if (n.id === maxCompletado + 1) return { ...n, estado: 'actual' };
            if (n.id > maxCompletado + 1) return { ...n, estado: 'bloqueado' };
            return n;
        });
        setNiveles(nuevosNiveles);
    }
    
    setMostrarLogin(false);
    setVistaActual('mapa');
  };

  const handleLoginProfe = () => {
    setMostrarLoginProfe(false);
    setVistaActual('dashboard_profe');
  };

  // --- SISTEMA DE RECOMPENSAS ---
  const guardarProgresoNivel = (nivelId) => {
    if (!usuario) return;

    const progresoActual = usuario.progresoNiveles || [];
    
    // Solo damos recompensa si es la PRIMERA VEZ que pasa el nivel
    if (!progresoActual.includes(nivelId)) {
        const nuevoProgreso = [...progresoActual, nivelId];
        
        // LÓGICA DE PREMIOS: +1 Racha, +50 Gemas
        const usuarioActualizado = { 
            ...usuario, 
            progresoNiveles: nuevoProgreso, 
            racha: (usuario.racha || 0) + 1, 
            gemas: (usuario.gemas || 0) + 50 
        };
        
        // 1. Actualizamos la App (Header se actualiza solo)
        setUsuario(usuarioActualizado);

        // 2. Guardamos en Base de Datos Local
        const todosLosUsuarios = JSON.parse(localStorage.getItem('palmita_demo_users') || '[]');
        const indice = todosLosUsuarios.findIndex(u => u.nombre === usuario.nombre);
        
        if (indice !== -1) {
            todosLosUsuarios[indice] = usuarioActualizado;
            localStorage.setItem('palmita_demo_users', JSON.stringify(todosLosUsuarios));
        }

        // 3. Desbloqueamos el siguiente nivel en el mapa
        const mapaActualizado = niveles.map(n => {
            if (n.id === nivelId) return { ...n, estado: 'completado' };
            if (n.id === nivelId + 1) return { ...n, estado: 'actual' };
            return n;
        });
        setNiveles(mapaActualizado);
    }
  };

  const mostrarNavegacion = vistaActual !== 'bienvenida' && vistaActual !== 'dashboard_profe' && vistaActual !== 'quiz';
  const mostrarToggleFlotante = vistaActual === 'bienvenida' || vistaActual === 'dashboard_profe';

  return (
    <div className={`app-duolingo theme-${theme}`}>
      {mostrarNavegacion && (
        // Pasamos 'usuario' al Header para que muestre gemas reales
        <HeaderBar 
            setMenuAbierto={setMenuAbierto} 
            setMenuAmpliado={setMenuAmpliado} 
            menuAmpliado={menuAmpliado} 
            usuario={usuario} 
            theme={theme}
            onToggleTheme={toggleTheme}
        />
      )}
      
      <div className={`overlay ${menuAbierto ? 'visible' : ''}`} onClick={() => setMenuAbierto(false)} />
      
      {mostrarNavegacion && (
        <SideMenu menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} setVistaActual={setVistaActual} vistaActual={vistaActual} menuAmpliado={menuAmpliado} />
      )}

      <main className={`contenido-principal ${!menuAmpliado ? 'menu-contraido' : ''} ${vistaActual==='bienvenida'?'full-width':''} ${vistaActual==='dashboard_profe'?'modo-profe':''}`}>
        
        {vistaActual === 'bienvenida' && (
          <>
            <MatrixParticles />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="tarjeta-central" style={{ zIndex: 10 }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', width: '100%' }}><PalmitaMascot width={220} gafasId={1} /></div>
              <h2 className="bienvenida">¡Bienvenido!</h2>
              <p className="mensaje">Aprende lógica de programación jugando.</p>
              <motion.button whileHover={{ scale: 1.05 }} className="boton-empezar" onClick={() => { audio.playSfx('click'); setMostrarLogin(true); }}>EMPEZAR</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="boton-ingresar" onClick={() => { audio.playSfx('click'); setMostrarLoginProfe(true); }}>INGRESAR COMO PROFESOR</motion.button>
            </motion.div>
          </>
        )}

        {vistaActual === 'mapa' && (
          <motion.div className="pantalla-interior mapa-aventura-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="titulo-seccion" style={{ marginBottom: '50px' }}>TU AVENTURA LÓGICA</h2>
            <div className="mapa-islas">
              {niveles.map((nivel, index) => {
                const residuo = index % 4;
                let posicionclase = residuo === 1 ? 'layout-izquierda' : (residuo === 3 ? 'layout-derecha' : '');
                return (
                  <div key={nivel.id} className={`fila-nivel ${posicionclase}`}>
                    <motion.div 
                      className={`isla-nivel ${nivel.estado === 'bloqueado' ? 'bloqueada' : ''}`}
                      whileHover={nivel.estado !== 'bloqueado' ? { scale: 1.1 } : {}}
                      onClick={() => {
                        if (nivel.estado !== 'bloqueado') {
                          audio.playSfx('click');
                          setNivelSeleccionado(nivel.id);
                          setVistaActual('quiz');
                        }
                      }}
                    >
                      {nivel.estado === 'actual' && <div className="burbuja-empezar">EMPEZAR</div>}
                      <div className={`icono-isla ${nivel.estado === 'actual' ? 'activa' : ''} ${nivel.estado === 'bloqueado' ? 'bloqueado' : ''}`}>
                         {nivel.estado === 'completado' ? 'Wm' : nivel.estado === 'actual' ? '⭐' : '🔒'}
                      </div>
                      <h3 className="etiqueta-nivel">{nivel.nombre}</h3>
                    </motion.div>
                  </div>
                );
              })}
              <div style={{ height: '150px' }}></div> 
            </div>
          </motion.div>
        )}

        {vistaActual === 'quiz' && (
          <QuizEngine 
            nivelId={nivelSeleccionado}
            alCerrar={() => setVistaActual('mapa')} 
            alCompletar={() => {
              // Aquí sucede la magia de la recompensa
              guardarProgresoNivel(nivelSeleccionado);
              setVistaActual('mapa');
            }} 
          />
        )}

        {vistaActual === 'logros' && <TrophyRoom usuario={usuario} />}
        {vistaActual === 'mascota' && <PalmitaCare />}
        {vistaActual === 'perfil' && <UserProfile usuario={usuario} />}
        {vistaActual === 'dashboard_profe' && <TeacherDashboard alSalir={() => setVistaActual('bienvenida')} />}
        
        {mostrarLogin && <AuthModal alCerrar={() => setMostrarLogin(false)} alAutenticar={handleLoginExitoso} />}
        {mostrarLoginProfe && <AuthModal alCerrar={() => setMostrarLoginProfe(false)} alAutenticar={handleLoginProfe} esProfesor={true} />}

      </main>

      {mostrarToggleFlotante && (
        <button
          className="btn-toggle-tema-float"
          onClick={() => { audio.playSfx('click'); toggleTheme(); }}
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? '🌞 Claro' : '🌙 Oscuro'}
        </button>
      )}
    </div>
  );
}

export default App;