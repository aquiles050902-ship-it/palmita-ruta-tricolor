import { LogOut, Users, TrendingUp, AlertTriangle } from "lucide-react";

export default function TeacherDashboard({ alSalir }) {
  // Datos falsos para simular la base de datos
  const alumnos = [
    { id: 1, nombre: "Juan Pérez", nivel: 5, racha: 12, estado: "activo" },
    { id: 2, nombre: "Ana García", nivel: 2, racha: 0, estado: "alerta" },
    { id: 3, nombre: "Luis Tovar", nivel: 8, racha: 5, estado: "activo" },
    { id: 4, nombre: "María Paz", nivel: 1, racha: 1, estado: "inactivo" },
  ];

  return (
    <div className="dashboard-profesor">
      {/* Barra Superior del Profe */}
      <header className="header-profe">
        <div className="titulo-profe">
          <h2>🍎 Panel Docente</h2>
          <span>Escuela: U.E. Ruta Tricolor</span>
        </div>
        <button className="btn-salir-profe" onClick={alSalir}>
          <LogOut size={20} /> Salir
        </button>
      </header>

      {/* Tarjetas de Resumen */}
      <div className="stats-grid">
        <div className="stat-card azul">
          <Users size={30} />
          <div>
            <h3>24</h3>
            <p>Alumnos Totales</p>
          </div>
        </div>
        <div className="stat-card verde">
          <TrendingUp size={30} />
          <div>
            <h3>85%</h3>
            <p>Promedio General</p>
          </div>
        </div>
        <div className="stat-card naranja">
          <AlertTriangle size={30} />
          <div>
            <h3>3</h3>
            <p>Requieren Ayuda</p>
          </div>
        </div>
      </div>

      {/* Tabla de Estudiantes */}
      <div className="tabla-container">
        <h3>Progreso de la Clase</h3>
        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Nivel Actual</th>
              <th>Racha</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td className="fw-bold">{alumno.nombre}</td>
                <td>Nivel {alumno.nivel}</td>
                <td>🔥 {alumno.racha}</td>
                <td>
                  <span className={`badge ${alumno.estado}`}>
                    {alumno.estado === 'activo' && 'Va bien'}
                    {alumno.estado === 'alerta' && 'Atascado'}
                    {alumno.estado === 'inactivo' && 'Ausente'}
                  </span>
                </td>
                <td>
                  <button className="btn-ver">Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}