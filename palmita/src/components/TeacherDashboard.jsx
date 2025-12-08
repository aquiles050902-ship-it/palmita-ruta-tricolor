import { LogOut, Users, TrendingUp, RefreshCw, Search, Trash2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import PalmitaMascot from "./PalmitaMascot"; 
import { apiObtenerEstudiantes, apiEliminarEstudiante } from "../services/api"; // Importación CLAVE

export default function TeacherDashboard({ alSalir }) {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
        // 1. Pedimos datos a la base de datos real
        const datosReales = await apiObtenerEstudiantes();
        
        const listaFormateada = datosReales.map(u => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido,
            nivel: u.nivelMax || 0,
            racha: u.racha || 0,
            gemas: u.gemas || 0,
            estado: (u.progresoNiveles && u.progresoNiveles.length > 0) ? 'activo' : 'nuevo'
        }));
        
        setAlumnos(listaFormateada);
    } catch (error) {
        console.error("Error cargando estudiantes:", error);
    } finally {
        setCargando(false);
    }
  };

  const pedirConfirmacion = (alumno) => {
    setAlumnoAEliminar(alumno);
  };

  const confirmarEliminacion = async () => {
    if (!alumnoAEliminar) return;
    try {
        await apiEliminarEstudiante(alumnoAEliminar.id);
        await cargarDatos();
    } catch (error) {
        console.error("No se pudo eliminar:", error);
    }
    setAlumnoAEliminar(null);
  };

  const cancelarEliminacion = () => {
    setAlumnoAEliminar(null);
  };

  useEffect(() => { cargarDatos(); }, []);

  return (
    <div className="dashboard-profesor">
      <header className="header-profe">
        <div className="perfil-escuela">
          <div className="logo-profe-container">
             <PalmitaMascot width={60} gafasId={2} crecimiento={10} /> 
          </div>
          <div>
            <h2>Panel Docente</h2>
            <span className="subtitulo-escuela">U.E. Anibal larez</span>
          </div>
        </div>

        <div className="acciones-header">
            <button className="btn-refresh" onClick={cargarDatos} disabled={cargando}>
                <RefreshCw size={18} className={cargando ? "spin" : ""}/> {cargando ? "Cargando..." : "Actualizar"}
            </button>
            <button className="btn-salir-profe" onClick={alSalir}>
                <LogOut size={18}/> Salir
            </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card azul">
          <div className="icono-stat"><Users size={28}/></div>
          <div><h3>{alumnos.length}</h3><p>Estudiantes</p></div>
        </div>
        <div className="stat-card verde">
          <div className="icono-stat"><TrendingUp size={28}/></div>
          <div>
            <h3>{alumnos.length > 0 ? (alumnos.reduce((acc, v) => acc + v.nivel, 0) / alumnos.length).toFixed(1) : 0}</h3>
            <p>Nivel Promedio</p>
          </div>
        </div>
      </div>

      <div className="tabla-container">
        <div className="tabla-header">
            <h3>📊 Progreso en Tiempo Real</h3>
            <div className="buscador-falso">
                <Search size={16} color="#aaa"/> 
                <span>Buscar estudiante...</span>
            </div>
        </div>

        <div className="tabla-scroll">
            <table className="tabla-moderna">
            <thead>
                <tr>
                <th style={{textAlign: 'center', width: '50px'}}>#</th>
                <th>Estudiante</th>
                <th>Nivel Actual</th>
                <th>Racha</th>
                <th>Gemas</th>
                <th>Estado</th>
                <th style={{textAlign: 'center'}}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {alumnos.length === 0 ? (
                    <tr><td colSpan="7" className="tabla-vacia">
                        {cargando ? "Cargando..." : "No hay alumnos registrados en la base de datos."}
                    </td></tr>
                ) : (
                    alumnos.map((a, index) => (
                    <tr key={a.id}>
                        {/* AQUI ESTÁ LA CORRECCIÓN NUMÉRICA (index + 1) */}
                        <td style={{textAlign: 'center', fontWeight: 'bold', color: '#888'}}>{index + 1}</td>
                        <td className="celda-nombre">
                            <div className="avatar-mini">{a.nombre.charAt(0).toUpperCase()}</div>
                            <div>
                                <strong>{a.nombre} {a.apellido}</strong>
                            </div>
                        </td>
                        <td><div className="badge-nivel">Nivel {a.nivel}</div></td>
                        <td>🔥 {a.racha}</td>
                        <td className="texto-gemas">💎 {a.gemas}</td>
                        <td>
                            <span className={`badge-estado ${a.estado}`}>
                                {a.estado === 'activo' ? '🟢 Activo' : '⚪ Nuevo'}
                            </span>
                        </td>
                        <td style={{textAlign: 'center'}}>
                            <button 
                                className="btn-eliminar" 
                                onClick={() => pedirConfirmacion(a)} 
                                title="Eliminar Estudiante"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>

      <AnimatePresence>
        {alumnoAEliminar && (
          <div className="auth-overlay" style={{zIndex: 3000}}>
            <motion.div 
              className="auth-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ maxWidth: '400px', textAlign: 'center', border: '2px solid #ff4b4b' }}
            >
              <div style={{ 
                  background: 'rgba(255, 75, 75, 0.1)', 
                  width: '60px', height: '60px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  margin: '0 auto 20px auto'
              }}>
                <AlertTriangle size={32} color="#ff4b4b" />
              </div>
              
              <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '22px' }}>¿Estás seguro?</h3>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>
                Vas a eliminar a <strong>{alumnoAEliminar.nombre}</strong> de la base de datos permanentemente.
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                    onClick={cancelarEliminacion}
                    style={{
                        padding: '12px 20px', borderRadius: '12px', border: 'none',
                        background: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    Cancelar
                </button>
                <button 
                    onClick={confirmarEliminacion}
                    style={{
                        padding: '12px 20px', borderRadius: '12px', border: 'none',
                        background: '#ff4b4b', color: 'white', cursor: 'pointer', fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(255, 75, 75, 0.3)'
                    }}
                >
                    Sí, Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}