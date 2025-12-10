import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import './App.css';
import AudioSettings from './components/AudioSettings';
import audio from './utils/audio';
import { apiGuardar } from './services/api'; 

import HeaderBar from './components/HeaderBar';
import SideMenu from './components/SideMenu';
import QuizEngine from './components/QuizEngine';
import AuthModal from './components/AuthModal';
import TrophyRoom from './components/TrophyRoom';
import PalmitaCare from './components/PalmitaCare';
import UserProfile from './components/UserProfile';
import TeacherDashboard from './components/TeacherDashboard';
import MasterDashboard from './components/MasterDashboard';
import PalmitaMascot from './components/PalmitaMascot'; 
import MatrixParticles from './components/MatrixParticles'; 

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuAmpliado, setMenuAmpliado] = useState(true);
  const [vistaActual, setVistaActual] = useState('bienvenida'); 
  const [mostrarLogin, setMostrarLogin] = useState(false); 
  const [mostrarLoginProfe, setMostrarLoginProfe] = useState(false);
  const [usuario, setUsuario] = useState(null); 
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);

  // --- LISTA DE 20 NIVELES PARA EL MAPA ---
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
    { id: 10, nombre: 'Conceptos', estado: 'bloqueado' },
    { id: 11, nombre: 'Bucles Anidados', estado: 'bloqueado' },
    { id: 12, nombre: 'Variables', estado: 'bloqueado' },
    { id: 13, nombre: 'Operadores Y/O', estado: 'bloqueado' },
    { id: 14, nombre: 'Funciones', estado: 'bloqueado' },
    { id: 15, nombre: 'Eventos Pro', estado: 'bloqueado' },
    { id: 16, nombre: 'Coordenadas X,Y', estado: 'bloqueado' },
    { id: 17, nombre: 'Listas (Arrays)', estado: 'bloqueado' },
    { id: 18, nombre: 'Búsqueda', estado: 'bloqueado' },
    { id: 19, nombre: 'Binario 0101', estado: 'bloqueado' },
    { id: 20, nombre: 'Soy Programador', estado: 'bloqueado' },
  ]);

  useEffect(() => {
    try { if (!localStorage.getItem('rt_hasVisited')) localStorage.setItem('rt_hasVisited', '1'); } catch (_) { }
    audio.initOnUserGesture();
  }, []);

  const [theme, setTheme] = useState(() => {
    try { const stored = localStorage.getItem('theme'); if (stored) return stored; } catch (_) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Lógica para actualizar el estado del mapa
  const actualizarMapa = (listaDesafios) => {
    // Si la lista es null o no es un array, usamos array vacío para evitar errores
    const desafiosSeguros = Array.isArray(listaDesafios) ? listaDesafios : [];

    // Filtramos SOLO los datos que sean texto y tengan guión (ej: "1-1").
    // Esto ELIMINA el error "id.split is not a function" si hay números sueltos.
    const desafiosValidos = desafiosSeguros.filter(id => typeof id === 'string' && id.includes('-'));

    const nivelesConProgreso = new Set(
        desafiosValidos.map(id => parseInt(id.split('-')[0]))
    );
    
    // Contar cuántos desafíos hay por cada nivel
    const conteoDesafios = desafiosValidos.reduce((acc, id) => {
        const nivel = parseInt(id.split('-')[0]);
        acc[nivel] = (acc[nivel] || 0) + 1;
        return acc;
    }, {});

    // Determinar el nivel más alto que tiene *al menos* un desafío completado
    const maxProgreso = niveles.reduce((maxId, n) => {
        return nivelesConProgreso.has(n.id) ? Math.max(maxId, n.id) : maxId;
    }, 0);

    const mapaActualizado = niveles.map(n => {
        // 1. Un nivel está 'completado' si tiene 5 desafíos completados.
        if (conteoDesafios[n.id] >= 5) return { ...n, estado: 'completado' };
        
        // 2. Un nivel está 'actual' si tiene progreso (1-4 desafíos) O si es el siguiente desbloqueable.
        const tieneProgreso = conteoDesafios[n.id] > 0;
        const esSiguienteDesbloqueado = n.id === maxProgreso + 1;
        
        if (tieneProgreso || esSiguienteDesbloqueado) {
             if (n.id <= 20) return { ...n, estado: 'actual' };
        }
        
        // 3. Bloqueado si su ID es mayor al siguiente desbloqueado.
        if (n.id > maxProgreso + 1) return { ...n, estado: 'bloqueado' };
        
        // Nivel 1 siempre es 'actual' si no hay progreso.
        if (n.id === 1 && desafiosValidos.length === 0) return { ...n, estado: 'actual' };

        return n; 
    });
    setNiveles(mapaActualizado);
  };

  const handleLoginExitoso = (datosUsuario) => {
    // --- LIMPIEZA DE DATOS CRÍTICA ---
    let rawProgreso = datosUsuario.progresoNiveles;
    
    // Si no es un array, lo convertimos en uno vacío
    if (!Array.isArray(rawProgreso)) rawProgreso = [];

    // Limpiamos los datos: solo strings con guión (ej: "1-1")
    // Aquí definimos 'desafiosCompletados' SIN acento
    const desafiosCompletados = rawProgreso.filter(item => typeof item === 'string' && item.includes('-')); 

    const usuarioConInventario = {
        ...datosUsuario,
        inventarioGafas: datosUsuario.inventarioGafas || [0, 1], 
        inventarioSombreros: datosUsuario.inventarioSombreros || [0], 
        nivelCrecimiento: datosUsuario.nivelCrecimiento || 0,
        progresoNiveles: desafiosCompletados 
    };
    setUsuario(usuarioConInventario); 
    
    // Solo actualizamos el mapa si es estudiante
    if (datosUsuario.rol === 'estudiante') {
        actualizarMapa(desafiosCompletados);
    }
    
    setMostrarLogin(false);
    setMostrarLoginProfe(false);

    if (datosUsuario.rol === 'master') setVistaActual('dashboard_master');
    else if (datosUsuario.rol === 'teacher') setVistaActual('dashboard_profe');
    else setVistaActual('mapa');
  };

  const handleLoginProfe = (datos) => handleLoginExitoso(datos);

  const actualizarUsuarioGlobal = (nuevoUsuario) => {
    setUsuario(nuevoUsuario);
    if (nuevoUsuario.id) apiGuardar(nuevoUsuario).catch(err => console.error("Error guardando:", err));
  };

  const guardarProgresoNivel = (desafioId) => {
    if (!usuario) return;
    const progresoActual = usuario.progresoNiveles || [];
    
    if (!progresoActual.includes(desafioId)) {
        const nuevoProgreso = [...progresoActual, desafioId];
        
        // Filtro de seguridad
        const progresoValido = nuevoProgreso.filter(id => typeof id === 'string' && id.includes('-'));

        const nivelesConProgreso = new Set(
            progresoValido.map(id => parseInt(id.split('-')[0]))
        );

        const usuarioActualizado = { 
            ...usuario, 
            progresoNiveles: nuevoProgreso, 
            racha: (usuario.racha || 0) + 1, 
            gemas: (usuario.gemas || 0) + 50,
            nivelMax: nivelesConProgreso.size
        };
        
        actualizarUsuarioGlobal(usuarioActualizado);
        actualizarMapa(nuevoProgreso); 
    }
  };

  const manejarDerrota = () => {
    if (!usuario) return;
    const nuevaRacha = Math.max(0, (usuario.racha || 0) - 1);
    const nuevasGemas = Math.max(0, (usuario.gemas || 0) - 20);
    const usuarioCastigado = { ...usuario, racha: nuevaRacha, gemas: nuevasGemas };
    actualizarUsuarioGlobal(usuarioCastigado);
  };

  const mostrarNavegacion = vistaActual !== 'bienvenida' && vistaActual !== 'dashboard_profe' && vistaActual !== 'dashboard_master' && vistaActual !== 'quiz';
  const mostrarToggleFlotante = ['bienvenida', 'dashboard_profe', 'dashboard_master'].includes(vistaActual);

  // Mapeo auxiliar
  const getLevelProgress = (nivelId) => {
    const lista = usuario?.progresoNiveles || [];
    if (!Array.isArray(lista)) return 0;
    return lista.filter(id => typeof id === 'string' && id.startsWith(`${nivelId}-`)).length;
  };
  
  return (
    <div className={`app-duolingo theme-${theme}`}>
      {mostrarNavegacion && <HeaderBar setMenuAbierto={setMenuAbierto} setMenuAmpliado={setMenuAmpliado} menuAmpliado={menuAmpliado} usuario={usuario} theme={theme} onToggleTheme={toggleTheme} />}
      <div className={`overlay ${menuAbierto ? 'visible' : ''}`} onClick={() => setMenuAbierto(false)} />
      {mostrarNavegacion && <SideMenu menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} setVistaActual={setVistaActual} vistaActual={vistaActual} menuAmpliado={menuAmpliado} />}

      <main className={`contenido-principal ${!menuAmpliado ? 'menu-contraido' : ''} ${vistaActual==='bienvenida'?'full-width':''} ${(vistaActual==='dashboard_profe' || vistaActual==='dashboard_master')?'modo-profe':''}`}>
        
        {vistaActual === 'bienvenida' && (
          <>
            <MatrixParticles />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="tarjeta-central" style={{ zIndex: 10 }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <PalmitaMascot width={220} gafasId={1} crecimiento={10} />
              </div>
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
                const progreso = getLevelProgress(nivel.id); 
                
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
                      {progreso < 5 && nivel.estado === 'actual' && <div className="burbuja-empezar">EMPEZAR</div>}
                      <div className={`icono-isla ${nivel.estado === 'completado' ? 'completado' : (nivel.estado === 'actual' ? 'activa' : 'bloqueado')}`}>
                         {nivel.estado === 'completado' ? 'Wm' : (nivel.estado === 'actual' ? '⭐' : '🔒')}
                      </div>
                      <h3 className="etiqueta-nivel">{nivel.nombre}</h3>
                      <p style={{marginTop:'5px', fontSize: '12px', fontWeight:'bold', color: progreso === 5 ? '#58cc02' : '#FF9600'}}>
                          {progreso} / 5 Desafíos
                      </p>
                    </motion.div>
                  </div>
                );
              })}
              <div style={{ height: '150px' }}></div> 
            </div>
          </motion.div>
        )}

        {vistaActual === 'quiz' && <QuizEngine 
            nivelId={nivelSeleccionado} 
            alCerrar={() => setVistaActual('mapa')} 
            alCompletar={(desafioId) => { 
              guardarProgresoNivel(desafioId); 
              setVistaActual('mapa'); 
            }} 
            alPerder={manejarDerrota}
            // PASAMOS LA VARIABLE CORRECTA SIN ACENTOS
            desafiosCompletados={usuario?.progresoNiveles || []} 
        />}
        
        {vistaActual === 'logros' && <TrophyRoom usuario={usuario} />}
        {vistaActual === 'mascota' && <PalmitaCare usuario={usuario} actualizarUsuario={actualizarUsuarioGlobal} />}
        {vistaActual === 'perfil' && <UserProfile usuario={usuario} />}
        {vistaActual === 'dashboard_profe' && <TeacherDashboard alSalir={() => setVistaActual('bienvenida')} />}
        {vistaActual === 'dashboard_master' && <MasterDashboard alSalir={() => setVistaActual('bienvenida')} />}
        {vistaActual === 'audio' && <AudioSettings />}
        {mostrarLogin && <AuthModal alCerrar={() => setMostrarLogin(false)} alAutenticar={handleLoginExitoso} />}
        {mostrarLoginProfe && <AuthModal alCerrar={() => setMostrarLoginProfe(false)} alAutenticar={handleLoginProfe} esProfesor={true} />}
      </main>
      {mostrarToggleFlotante && <button className="btn-toggle-tema-float" onClick={() => { audio.playSfx('click'); toggleTheme(); }} title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}>{theme === 'dark' ? '🌞 Claro' : '🌙 Oscuro'}</button>}
    </div>
  );
}

export default App;