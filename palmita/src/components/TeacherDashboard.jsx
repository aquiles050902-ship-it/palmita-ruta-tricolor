import { LogOut, Users, TrendingUp, RefreshCw, Search, Trash2, AlertTriangle, FileText, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import PalmitaMascot from "./PalmitaMascot"; 
import { apiObtenerEstudiantes, apiEliminarEstudiante } from "../services/api";

// --- CAMBIO IMPORTANTE EN LAS IMPORTACIONES ---
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default function TeacherDashboard({ alSalir }) {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const [alumnoReporte, setAlumnoReporte] = useState(null);
  const [cargando, setCargando] = useState(false);

  // --- CARGAR DATOS ---
  const cargarDatos = async () => {
    setCargando(true);
    try {
        const datosReales = await apiObtenerEstudiantes();
        const listaFormateada = datosReales.map(u => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido,
            nivel: u.nivelMax || 0,
            racha: u.racha || 0,
            gemas: u.gemas || 0,
            estado: (u.progresoNiveles && u.progresoNiveles.length > 0) ? 'activo' : 'nuevo',
            estadisticas: u.estadisticas || {} 
        }));
        setAlumnos(listaFormateada);
    } catch (error) { console.error(error); } finally { setCargando(false); }
  };

  const confirmarEliminacion = async () => {
    if (!alumnoAEliminar) return;
    try { await apiEliminarEstudiante(alumnoAEliminar.id); await cargarDatos(); } catch (error) { console.error(error); }
    setAlumnoAEliminar(null);
  };

  useEffect(() => { cargarDatos(); }, []);

  // --- LÓGICA DE ESTADÍSTICAS ---
  const obtenerDebilidad = (stats) => {
    let peorNivel = null;
    let maxFallos = -1;
    if (!stats) return "Ninguna";
    Object.keys(stats).forEach(nivel => {
        if (stats[nivel].fallos > maxFallos) {
            maxFallos = stats[nivel].fallos;
            peorNivel = nivel;
        }
    });
    return peorNivel ? `Nivel ${peorNivel}` : "Ninguna";
  };

  // --- GENERAR PDF (VERSIÓN ROBUSTA) ---
  const generarPDF = () => {
    try {
        if (!alumnoReporte) {
            alert("Error: No hay datos de alumno seleccionados.");
            return;
        }
        
        // 1. Crear documento
        const doc = new jsPDF();

        // 2. Encabezado
        doc.setFontSize(22);
        doc.setTextColor(0, 102, 255);
        doc.text("Palmita - Reporte Académico", 14, 20);
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("U.E. Anibal Larez", 14, 28);
        doc.setDrawColor(200);
        doc.line(14, 32, 196, 32);

        // 3. Datos del Estudiante
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Estudiante: ${alumnoReporte.nombre} ${alumnoReporte.apellido}`, 14, 45);
        doc.setFontSize(11);
        doc.text(`Nivel Actual: ${alumnoReporte.nivel}   |   Racha: ${alumnoReporte.racha} días`, 14, 52);
        doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 59);

        // 4. Tabla de Estadísticas
        const tablaData = Object.entries(alumnoReporte.estadisticas || {}).map(([nivel, datos]) => {
            const total = (datos.aciertos || 0) + (datos.fallos || 0);
            const efic = total > 0 ? Math.round((datos.aciertos / total) * 100) : 0;
            return [`Nivel ${nivel}`, datos.aciertos || 0, datos.fallos || 0, `${efic}%`];
        });

        if (tablaData.length === 0) {
            doc.text("No hay datos de juego registrados aún.", 14, 70);
        } else {
            // Usamos autoTable de forma segura
            autoTable(doc, {
                startY: 65,
                head: [['Nivel', 'Aciertos', 'Fallos', 'Efectividad']],
                body: tablaData,
                theme: 'grid',
                headStyles: { fillColor: [0, 102, 255] },
                styles: { halign: 'center' },
            });
        }

        // 5. Diagnóstico
        const finalY = (doc).lastAutoTable ? (doc).lastAutoTable.finalY : 70;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Diagnóstico Automático:", 14, finalY + 15);
        
        doc.setFontSize(11);
        doc.setTextColor(80);
        const debilidad = obtenerDebilidad(alumnoReporte.estadisticas);
        const mensaje = tablaData.length === 0 
            ? "El estudiante debe completar al menos un nivel para generar estadísticas."
            : `El estudiante presenta mayor número de errores en: ${debilidad}. Se recomienda reforzar los conceptos asociados a este nivel.`;
        
        const splitText = doc.splitTextToSize(mensaje, 180);
        doc.text(splitText, 14, finalY + 22);

        // 6. Guardar
        doc.save(`Reporte_${alumnoReporte.nombre}_${alumnoReporte.apellido}.pdf`);

    } catch (err) {
        console.error("Error al generar PDF:", err);
        alert("Hubo un error al crear el PDF. Revisa la consola (F12) para más detalles.\n\nError: " + err.message);
    }
  };

  return (
    <div className="dashboard-profesor">
      <header className="header-profe">
        <div className="perfil-escuela">
          <div className="logo-profe-container"><PalmitaMascot width={60} gafasId={2} crecimiento={10} /></div>
          <div><h2>Panel Docente</h2><span className="subtitulo-escuela">U.E. Anibal larez</span></div>
        </div>
        <div className="acciones-header">
            <button className="btn-refresh" onClick={cargarDatos} disabled={cargando}><RefreshCw size={18} className={cargando ? "spin" : ""}/> Actualizar</button>
            <button className="btn-salir-profe" onClick={alSalir}><LogOut size={18}/> Salir</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card azul"><div className="icono-stat"><Users size={28}/></div><div><h3>{alumnos.length}</h3><p>Estudiantes</p></div></div>
        <div className="stat-card verde"><div className="icono-stat"><TrendingUp size={28}/></div><div><h3>{alumnos.length>0?(alumnos.reduce((acc,v)=>acc+v.nivel,0)/alumnos.length).toFixed(1):0}</h3><p>Nivel Promedio</p></div></div>
      </div>

      <div className="tabla-container">
        <div className="tabla-header"><h3>📊 Progreso en Tiempo Real</h3><div className="buscador-falso"><Search size={16} color="#aaa"/> <span>Buscar...</span></div></div>
        <div className="tabla-scroll">
            <table className="tabla-moderna">
            <thead><tr><th>#</th><th>Estudiante</th><th>Nivel</th><th>Debilidad</th><th>Estado</th><th style={{textAlign:'center'}}>Acciones</th></tr></thead>
            <tbody>
                {alumnos.map((a, i) => (
                    <tr key={a.id}>
                        <td style={{textAlign:'center', fontWeight:'bold', color:'#888'}}>{i + 1}</td>
                        <td className="celda-nombre"><div className="avatar-mini">{a.nombre.charAt(0)}</div><strong>{a.nombre} {a.apellido}</strong></td>
                        <td><div className="badge-nivel">Nivel {a.nivel}</div></td>
                        <td style={{color: '#ff4b4b', fontWeight:'bold'}}>{obtenerDebilidad(a.estadisticas)}</td>
                        <td><span className={`badge-estado ${a.estado}`}>{a.estado==='activo'?'🟢 Activo':'⚪ Nuevo'}</span></td>
                        <td style={{textAlign:'center', display:'flex', justifyContent:'center', gap:'10px'}}>
                            <button className="btn-eliminar" style={{background:'#0066FF22', color:'#0066FF', borderColor:'#0066FF55'}} onClick={() => setAlumnoReporte(a)} title="Ver Reporte"><FileText size={18}/></button>
                            <button className="btn-eliminar" onClick={() => setAlumnoAEliminar(a)} title="Eliminar"><Trash2 size={18}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* MODAL DE REPORTE DETALLADO */}
      <AnimatePresence>
        {alumnoReporte && (
          <div className="auth-overlay" style={{zIndex: 3000}}>
            <motion.div className="auth-card" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} style={{maxWidth:'600px', width:'90%'}}>
              <button className="btn-cerrar-modal" onClick={() => setAlumnoReporte(null)} style={{color:'white'}}>×</button>
              
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                  <div>
                    <h2 style={{color:'white', margin:0}}>Reporte Académico</h2>
                    <p style={{color:'#aaa', margin:0}}>Estudiante: <strong style={{color:'#FFD700'}}>{alumnoReporte.nombre} {alumnoReporte.apellido}</strong></p>
                  </div>
                  {/* BOTÓN DESCARGAR PDF */}
                  <button onClick={generarPDF} style={{background:'#0066FF', color:'white', border:'none', padding:'8px 15px', borderRadius:'8px', cursor:'pointer', display:'flex', gap:'5px', alignItems:'center', fontWeight:'bold'}}>
                      <Download size={16}/> PDF
                  </button>
              </div>

              <div style={{maxHeight:'300px', overflowY:'auto'}}>
                <table className="tabla-moderna" style={{width:'100%'}}>
                    <thead style={{position:'sticky', top:0, background:'#111'}}>
                        <tr>
                            <th style={{color:'#00C2CB'}}>Nivel</th>
                            <th style={{color:'#58cc02'}}>Aciertos ✅</th>
                            <th style={{color:'#ff4b4b'}}>Fallos ❌</th>
                            <th>Desempeño</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(alumnoReporte.estadisticas).length === 0 ? (
                            <tr><td colSpan="4" style={{textAlign:'center', padding:'20px', color:'#666'}}>Sin datos registrados aún.</td></tr>
                        ) : (
                            Object.entries(alumnoReporte.estadisticas).map(([nivel, datos]) => {
                                const total = (datos.aciertos || 0) + (datos.fallos || 0);
                                const efectividad = total > 0 ? Math.round((datos.aciertos / total) * 100) : 0;
                                return (
                                    <tr key={nivel}>
                                        <td style={{fontWeight:'bold'}}>Nivel {nivel}</td>
                                        <td style={{color:'#58cc02', fontWeight:'bold'}}>{datos.aciertos || 0}</td>
                                        <td style={{color:'#ff4b4b', fontWeight:'bold'}}>{datos.fallos || 0}</td>
                                        <td>
                                            <div style={{width:'100%', background:'#333', height:'6px', borderRadius:'3px', overflow:'hidden'}}>
                                                <div style={{width:`${efectividad}%`, background: efectividad > 70 ? '#58cc02' : (efectividad > 40 ? '#FFD700' : '#ff4b4b'), height:'100%'}}></div>
                                            </div>
                                            <small style={{fontSize:'10px', color:'#aaa'}}>{efectividad}% Efic.</small>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
              </div>

              <div style={{background:'#222', padding:'15px', borderRadius:'10px', marginTop:'20px', borderLeft:'4px solid #0066FF'}}>
                  <h4 style={{margin:'0 0 5px 0', color:'#0066FF'}}>Diagnóstico Docente:</h4>
                  <p style={{margin:0, fontSize:'13px', color:'#ddd'}}>
                     {Object.keys(alumnoReporte.estadisticas).length === 0 
                        ? "El estudiante aún no ha completado actividades suficientes para un diagnóstico."
                        : `El estudiante presenta mayor dificultad en: ${obtenerDebilidad(alumnoReporte.estadisticas)}. Se sugiere reforzar conceptos básicos de este tema.`
                     }
                  </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Modal Eliminar */}
      <AnimatePresence>
        {alumnoAEliminar && (
           <div className="auth-overlay" style={{zIndex: 3000}}>
             <motion.div className="auth-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '400px', textAlign: 'center', border: '2px solid #ff4b4b' }}>
               <AlertTriangle size={40} color="#ff4b4b" style={{margin:'0 auto 10px'}}/>
               <h3 style={{color:'white'}}>¿Eliminar estudiante?</h3>
               <div style={{display:'flex', gap:'10px', justifyContent:'center', marginTop:'20px'}}>
                 <button onClick={() => setAlumnoAEliminar(null)} style={{background:'#333', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer'}}>Cancelar</button>
                 <button onClick={confirmarEliminacion} style={{background:'#ff4b4b', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer'}}>Eliminar</button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}