import { useState, useEffect } from "react";
import { LogOut, Users, GraduationCap, RefreshCw, Crown, Trash2, FileText, PlusCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiObtenerEstudiantes, apiObtenerProfesores, apiEliminarEstudiante, apiEliminarProfesor } from "../services/api";
import AuthModal from "./AuthModal";

export default function MasterDashboard({ alSalir }) {
  const [vista, setVista] = useState('profesores'); // 'profesores' o 'estudiantes'
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  // Estados para Modales
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [elementoAEliminar, setElementoAEliminar] = useState(null);
  const [estudianteReporte, setEstudianteReporte] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      if (vista === 'estudiantes') {
        const datos = await apiObtenerEstudiantes();
        setLista(datos);
      } else {
        const datos = await apiObtenerProfesores();
        setLista(datos);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, [vista]);

  const handleEliminar = async () => {
      if (!elementoAEliminar) return;
      try {
          if (vista === 'estudiantes') {
              await apiEliminarEstudiante(elementoAEliminar.id);
          } else {
              await apiEliminarProfesor(elementoAEliminar.id);
          }
          await cargarDatos(); // Recargar tabla
          setElementoAEliminar(null);
      } catch (error) {
          alert("Error al eliminar: " + error.message);
      }
  };

  // Función auxiliar para reporte (con seguridad para evitar crashes)
  const obtenerDebilidad = (stats) => {
    let peor = "Ninguna"; let max = -1;
    if (!stats || typeof stats !== 'object') return peor;
    Object.keys(stats).forEach(k => {
        if(stats[k]?.fallos > max) { max = stats[k].fallos; peor = `Nivel ${k}`; }
    });
    return peor;
  };

  return (
    <div className="dashboard-profesor" style={{ maxWidth: '1200px' }}>
      <header className="header-profe" style={{ borderColor: '#FFD700', boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)' }}>
        <div className="perfil-escuela">
          <div className="logo-profe-container" style={{ borderColor: '#FFD700' }}>
             <Crown size={35} color="#FFD700" /> 
          </div>
          <div>
            <h2 style={{ color: '#FFD700' }}>Panel Director</h2>
            <span className="subtitulo-escuela">Super Administrador</span>
          </div>
        </div>

        <div className="acciones-header">
            <button className="btn-refresh" onClick={cargarDatos}><RefreshCw size={18} className={cargando ? "spin" : ""}/></button>
            <button className="btn-salir-profe" onClick={alSalir}><LogOut size={18}/> Salir</button>
        </div>
      </header>

      {/* Navegación Interna */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button 
            onClick={() => setVista('profesores')}
            style={{ 
                flex: 1, padding: '15px', borderRadius: '15px', border: 'none',
                background: vista === 'profesores' ? '#FFD700' : '#222',
                color: vista === 'profesores' ? '#111' : '#888',
                fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.3s'
            }}
        >
            <GraduationCap /> Ver Profesores
        </button>
        <button 
            onClick={() => setVista('estudiantes')}
            style={{ 
                flex: 1, padding: '15px', borderRadius: '15px', border: 'none',
                background: vista === 'estudiantes' ? '#0066FF' : '#222',
                color: vista === 'estudiantes' ? '#fff' : '#888',
                fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.3s'
            }}
        >
            <Users /> Ver Estudiantes
        </button>
      </div>

      <div className="tabla-container">
        <div className="tabla-header" style={{ borderBottom: '1px solid #333' }}>
            <h3 style={{ margin: 0 }}>
                {vista === 'profesores' ? '👨‍🏫 Listado de Docentes' : '👨‍🎓 Progreso de Estudiantes'}
            </h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                {/* BOTÓN REGISTRAR NUEVO */}
                <button 
                    onClick={() => setMostrarRegistro(true)}
                    style={{ 
                        background: '#58cc02', color: 'white', border: 'none', 
                        padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' 
                    }}
                >
                    <PlusCircle size={18} /> Registrar {vista === 'profesores' ? 'Profesor' : 'Estudiante'}
                </button>
            </div>
        </div>
        
        <div className="tabla-scroll">
            <table className="tabla-moderna">
            <thead>
                <tr>
                    <th>Nombre</th>
                    {vista === 'profesores' && <th>Correo</th>}
                    <th>Cédula</th>
                    {vista === 'estudiantes' && <><th>Nivel</th><th>Rendimiento</th></>}
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {lista.map((item, idx) => (
                    <tr key={idx}>
                        <td style={{ fontWeight: 'bold' }}>{item.nombre} {item.apellido}</td>
                        
                        {/* Profesores tienen correo, Estudiantes NO */}
                        {vista === 'profesores' && <td>{item.email}</td>}
                        
                        <td>{item.cedula}</td>
                        
                        {/* Columnas extra de Estudiantes */}
                        {vista === 'estudiantes' && (
                            <>
                                <td><span className="badge-nivel">Nivel {item.nivel || item.nivelMax || 0}</span></td>
                                <td>
                                    {/* Barra de progreso simple basada en gemas/racha */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <small style={{ color: '#aaa', fontSize: '10px' }}>Debilidad: {obtenerDebilidad(item.estadisticas)}</small>
                                        <div style={{ width: '100px', height: '4px', background: '#333', borderRadius: '2px' }}>
                                            <div style={{ width: `${Math.min(100, (item.nivelMax || 0)*5)}%`, height: '100%', background: '#00C2CB' }}></div>
                                        </div>
                                    </div>
                                </td>
                            </>
                        )}

                        <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                             {/* BOTÓN REPORTE (Solo Estudiantes) */}
                             {vista === 'estudiantes' && (
                                <button 
                                    className="btn-eliminar" 
                                    style={{ background: '#0066FF22', color: '#0066FF', borderColor: '#0066FF55' }}
                                    onClick={() => setEstudianteReporte(item)}
                                    title="Ver Reporte Detallado"
                                >
                                    <FileText size={18} />
                                </button>
                             )}

                             {/* BOTÓN ELIMINAR (Ambos) */}
                             <button 
                                className="btn-eliminar" 
                                onClick={() => setElementoAEliminar(item)}
                                title={`Eliminar ${vista === 'profesores' ? 'Profesor' : 'Estudiante'}`}
                             >
                                <Trash2 size={18} />
                             </button>
                        </td>
                    </tr>
                ))}
                {lista.length === 0 && <tr><td colSpan="6" className="tabla-vacia">No hay datos registrados.</td></tr>}
            </tbody>
            </table>
        </div>
      </div>

      {/* === MODAL DE REGISTRO === */}
      {mostrarRegistro && (
          <AuthModal 
            alCerrar={() => { setMostrarRegistro(false); cargarDatos(); }} // Al cerrar recargamos la tabla
            esProfesor={vista === 'profesores'}
            modoAdmin={true} // Forzamos modo registro admin
            alAutenticar={() => {}} // No hace nada al autenticar en este modo
          />
      )}

      {/* === MODAL CONFIRMAR ELIMINACIÓN === */}
      <AnimatePresence>
        {elementoAEliminar && (
           <div className="auth-overlay" style={{zIndex: 3000}}>
             <motion.div className="auth-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '400px', textAlign: 'center', border: '2px solid #ff4b4b' }}>
               <AlertTriangle size={40} color="#ff4b4b" style={{margin:'0 auto 10px'}}/>
               <h3 style={{color:'white'}}>¿Eliminar {vista === 'profesores' ? 'Profesor' : 'Estudiante'}?</h3>
               <p style={{color:'#aaa'}}>Se borrará a <strong>{elementoAEliminar.nombre}</strong> de la base de datos permanentemente.</p>
               <div style={{display:'flex', gap:'10px', justifyContent:'center', marginTop:'20px'}}>
                 <button onClick={() => setElementoAEliminar(null)} style={{background:'#333', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer'}}>Cancelar</button>
                 <button onClick={handleEliminar} style={{background:'#ff4b4b', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer'}}>Eliminar</button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* === MODAL REPORTE (COPIADO DEL TEACHER DASHBOARD) === */}
      <AnimatePresence>
        {estudianteReporte && (
          <div className="auth-overlay" style={{zIndex: 3000}}>
            <motion.div 
                className="auth-card" 
                initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} 
                style={{maxWidth:'600px', width:'90%'}}
            >
              <button className="btn-cerrar-modal" onClick={() => setEstudianteReporte(null)} style={{color:'white'}}>×</button>
              <div style={{textAlign:'center', marginBottom:'20px'}}>
                <h2 style={{color:'white', margin:0}}>Reporte: {estudianteReporte.nombre}</h2>
              </div>
              <div style={{maxHeight:'300px', overflowY:'auto'}}>
                <table className="tabla-moderna" style={{width:'100%'}}>
                    <thead style={{position:'sticky', top:0, background:'#111'}}>
                        <tr><th style={{color:'#00C2CB'}}>Nivel</th><th style={{color:'#58cc02'}}>Aciertos</th><th style={{color:'#ff4b4b'}}>Fallos</th></tr>
                    </thead>
                    <tbody>
                        {(!estudianteReporte.estadisticas || Object.keys(estudianteReporte.estadisticas).length === 0) ? (
                            <tr><td colSpan="3" style={{textAlign:'center', padding:'20px', color:'#666'}}>Sin datos.</td></tr>
                        ) : (
                            Object.entries(estudianteReporte.estadisticas).map(([nivel, d]) => (
                                <tr key={nivel}>
                                    <td>Nivel {nivel}</td>
                                    <td style={{color:'#58cc02'}}>{d.aciertos}</td>
                                    <td style={{color:'#ff4b4b'}}>{d.fallos}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}