import PalmitaMascot from "./PalmitaMascot"; 

export default function PalmitaCare() {
  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">🌴 Cuida a tu Palmita</h2>
      
      <div className="escenario-palmita" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        {/* Aquí usamos tu nueva mascota animada */}
        <PalmitaMascot width={280} />
      </div>

      <div className="controles-palmita" style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#aaa', marginBottom: '15px' }}>¡Dale cariño para que siga creciendo!</p>
        
        <div className="botones-accion" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn-accion" style={estiloBoton}>🕶️ Gafas</button>
          <button className="btn-accion" style={estiloBoton}>🎩 Sombrero</button>
          <button className="btn-accion" style={estiloBoton}>💧 Regar</button>
        </div>
      </div>
    </div>
  );
}

// Estilos rápidos para los botones
const estiloBoton = {
  background: '#333',
  border: '2px solid #555',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
};