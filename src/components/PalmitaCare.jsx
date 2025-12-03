import { useState } from "react";
import { motion } from "framer-motion";
import PalmitaMascot from "./PalmitaMascot"; 

export default function PalmitaCare() {
  // ESTADOS (Indices)
  const [gafasId, setGafasId] = useState(1);       // Empieza con Hacker (1)
  const [sombreroId, setSombreroId] = useState(0); // Empieza sin sombrero (0)
  const [rainId, setRainId] = useState(1);         // Tipo de lluvia 1 (Agua)
  const [regando, setRegando] = useState(false);

  // NOMBRES PARA MOSTRAR EN PANTALLA
  const nombresGafas = ["Ninguna", "Hacker", "Sol", "Corazones", "Harry", "3D", "Estrellas", "Monóculo", "Cíclope", "Esquí", "Pixel"];
  const nombresSombreros = ["Ninguno", "Mago", "Corona", "Gorra", "Chef", "Vikingo", "Graduación", "Pirata", "Fiesta", "Vaquero", "Astronauta"];
  const nombresLluvia = ["", "Agua", "Código Matrix", "Gemas"];

  const cycleGafas = () => {
    // Ciclo del 0 al 10 (11 opciones)
    setGafasId((prev) => (prev + 1) % 11);
  };

  const cycleSombrero = () => {
    // Ciclo del 0 al 10
    setSombreroId((prev) => (prev + 1) % 11);
  };

  const cycleRain = () => {
    // Ciclo del 1 al 3 (cambia el tipo y riega)
    const nextRain = (rainId % 3) + 1;
    setRainId(nextRain);
    triggerRiego();
  };

  const triggerRiego = () => {
    setRegando(true);
    setTimeout(() => setRegando(false), 2500);
  };

  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">🌴 Personaliza a Palmita</h2>
      
      <div className="escenario-palmita" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '20px',
        height: '350px',
        alignItems: 'flex-end',
        position: 'relative'
      }}>
        <PalmitaMascot 
          width={280} 
          gafasId={gafasId} 
          sombreroId={sombreroId} 
          tipoLluvia={rainId}
          regando={regando} 
        />
      </div>

      <div className="controles-palmita" style={{ textAlign: 'center', marginTop: '20px' }}>
        
        <div className="botones-accion" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          
          <BotonCiclo 
            icono="🕶️" 
            titulo="Gafas"
            detalle={nombresGafas[gafasId]}
            onClick={cycleGafas}
            color="#333"
          />
          
          <BotonCiclo 
            icono="🎩" 
            titulo="Sombrero"
            detalle={nombresSombreros[sombreroId]}
            onClick={cycleSombrero}
            color="#333"
          />
          
          <BotonCiclo 
            icono="💧" 
            titulo="Lluvia"
            detalle={nombresLluvia[rainId]}
            onClick={cycleRain}
            color="#00C2CB"
            activo={regando}
          />

        </div>
      </div>
    </div>
  );
}

function BotonCiclo({ icono, titulo, detalle, onClick, color, activo }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: color,
        border: activo ? '2px solid white' : '2px solid #555',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '16px',
        cursor: 'pointer',
        minWidth: '110px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}
    >
      <span style={{ fontSize: '24px' }}>{icono}</span>
      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{titulo}</span>
      <span style={{ fontSize: '11px', color: '#ccc' }}>{detalle}</span>
    </motion.button>
  );
}