import { useState, useEffect } from "react";
import { LogOut, Users, GraduationCap, RefreshCw, Crown } from "lucide-react";
import { apiObtenerEstudiantes, apiObtenerProfesores } from "../services/api";

export default function MasterDashboard({ alSalir }) {
  const [vista, setVista] = useState('profesores'); // 'profesores' o 'estudiantes'
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);

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
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, [vista]);

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
        <h3 style={{ padding: '20px', margin: 0, borderBottom: '1px solid var(--border)' }}>
            {vista === 'profesores' ? '👨‍🏫 Listado de Docentes' : '👨‍🎓 Progreso de Estudiantes'}
        </h3>
        
        <div className="tabla-scroll">
            <table className="tabla-moderna">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    {vista === 'profesores' && <th>Cédula</th>}
                    {vista === 'estudiantes' && <><th>Nivel</th><th>Racha</th><th>Gemas</th></>}
                </tr>
            </thead>
            <tbody>
                {lista.map((item, idx) => (
                    <tr key={idx}>
                        <td style={{ fontWeight: 'bold' }}>{item.nombre} {item.apellido}</td>
                        <td>{item.email}</td>
                        {vista === 'profesores' && <td>{item.cedula}</td>}
                        {vista === 'estudiantes' && (
                            <>
                                <td><span className="badge-nivel">Nivel {item.nivel || item.nivelMax || 0}</span></td>
                                <td>🔥 {item.racha || 0}</td>
                                <td>💎 {item.gemas || 0}</td>
                            </>
                        )}
                    </tr>
                ))}
                {lista.length === 0 && <tr><td colSpan="5" className="tabla-vacia">No hay datos registrados.</td></tr>}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}