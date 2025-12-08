import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Gem, ChevronRight, ChevronLeft, CloudRain } from "lucide-react";
import PalmitaMascot from "./PalmitaMascot";
import audio from "../utils/audio";

// 1. AJUSTE DE PRECIO: Lluvia ahora cuesta 80
const PRECIOS = {
  lluvia: 80,
  gafas: [0, 0, 50, 80, 100, 120, 150, 200, 250, 300, 500],
  sombreros: [0, 100, 150, 120, 200, 250, 300, 350, 400, 450, 600]
};

const NOMBRES_GAFAS = ["Ninguna", "Hacker", "Sol", "Corazones", "Harry", "3D", "Estrellas", "Monóculo", "Cíclope", "Esquí", "Pixel"];
const NOMBRES_SOMBREROS = ["Ninguno", "Mago", "Corona", "Gorra", "Chef", "Vikingo", "Graduación", "Pirata", "Fiesta", "Vaquero", "Astronauta"];

export default function PalmitaCare({ usuario, actualizarUsuario }) {
  const [gafasIndex, setGafasIndex] = useState(usuario?.gafasId || 1);
  const [sombreroIndex, setSombreroIndex] = useState(usuario?.sombreroId || 0);
  const [regando, setRegando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const inventarioGafas = usuario?.inventarioGafas || [0, 1];
  const inventarioSombreros = usuario?.inventarioSombreros || [0];
  const nivelCrecimiento = usuario?.nivelCrecimiento || 0;

  const cambiarItem = (tipo, direccion) => {
    if (tipo === 'gafas') {
      let nuevo = gafasIndex + direccion;
      if (nuevo < 0) nuevo = NOMBRES_GAFAS.length - 1;
      if (nuevo >= NOMBRES_GAFAS.length) nuevo = 0;
      setGafasIndex(nuevo);
    } else {
      let nuevo = sombreroIndex + direccion;
      if (nuevo < 0) nuevo = NOMBRES_SOMBREROS.length - 1;
      if (nuevo >= NOMBRES_SOMBREROS.length) nuevo = 0;
      setSombreroIndex(nuevo);
    }
    audio.playSfx('click');
  };

  const handleAccionItem = (tipo, id, precio) => {
    const esGafas = tipo === 'gafas';
    const inventario = esGafas ? inventarioGafas : inventarioSombreros;
    const yaLoTiene = inventario.includes(id);

    if (yaLoTiene) {
      const nuevoUsuario = { 
        ...usuario, 
        [esGafas ? 'gafasId' : 'sombreroId']: id 
      };
      actualizarUsuario(nuevoUsuario);
      audio.playSfx('click');
    } else {
      if (usuario.gemas >= precio) {
        const nuevoInventario = [...inventario, id];
        const nuevoUsuario = {
          ...usuario,
          gemas: usuario.gemas - precio,
          [esGafas ? 'inventarioGafas' : 'inventarioSombreros']: nuevoInventario,
          [esGafas ? 'gafasId' : 'sombreroId']: id
        };
        actualizarUsuario(nuevoUsuario);
        audio.playSfx('success');
      } else {
        mostrarError("¡Te faltan gemas!");
      }
    }
  };

  const handleRiego = () => {
    if (regando) return;
    if (nivelCrecimiento >= 10) {
      mostrarError("¡Palmita ya creció al máximo!");
      return;
    }

    if (usuario.gemas >= PRECIOS.lluvia) {
      setRegando(true);
      audio.playSfx('success');
      setTimeout(() => {
        const nuevoNivel = Math.min(10, nivelCrecimiento + 1);
        const nuevoUsuario = {
          ...usuario,
          gemas: usuario.gemas - PRECIOS.lluvia,
          nivelCrecimiento: nuevoNivel
        };
        actualizarUsuario(nuevoUsuario);
        setRegando(false);
      }, 2500);
    } else {
      mostrarError("Necesitas más gemas para el agua");
    }
  };

  const mostrarError = (msg) => {
    setMensajeError(msg);
    audio.playSfx('error');
    setTimeout(() => setMensajeError(""), 2000);
  };

  return (
    // Usamos flex: 1 para que ocupe el espacio disponible y evite scroll innecesario
    <div className="pantalla-interior" style={{ height: '100%', justifyContent: 'space-evenly', paddingBottom: 0 }}>
      
      {/* Título más compacto */}
      <h2 className="titulo-seccion" style={{ marginBottom: '10px', fontSize: '24px' }}>🌴 Cuida y Personaliza</h2>
      
      {mensajeError && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{ position:'absolute', top: 70, zIndex: 100, background: '#ff4b4b', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}
        >
          {mensajeError}
        </motion.div>
      )}

      {/* 2. ESCENARIO COMPACTO: Reduje altura y padding */}
      <div className="escenario-palmita" style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        padding: '0px', height: '240px', position: 'relative', marginTop: '10px'
      }}>
        {/* 3. PREVISUALIZACIÓN: Ahora pasamos 'gafasIndex' y 'sombreroIndex' directamente */}
        <PalmitaMascot 
          width={200} // Reduje el tamaño base para que quepa mejor
          gafasId={gafasIndex} 
          sombreroId={sombreroIndex} 
          tipoLluvia={1}
          regando={regando} 
          crecimiento={nivelCrecimiento}
        />
        
        {/* Barra de Nivel Compacta */}
        <div style={{ position: 'absolute', right: 10, top: 10, textAlign: 'center' }}>
            <div style={{ height: '120px', width: '16px', background: '#333', borderRadius: '10px', padding: '2px', display: 'flex', alignItems: 'flex-end' }}>
                <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${nivelCrecimiento * 10}%` }}
                    style={{ width: '100%', background: 'linear-gradient(to top, #58cc02, #81f22e)', borderRadius: '8px' }}
                />
            </div>
            <small style={{ color: '#aaa', fontWeight: 'bold', fontSize: '10px' }}>Nivel {nivelCrecimiento}</small>
        </div>
      </div>

      {/* CONTROLES TIENDA COMPACTOS */}
      <div className="controles-palmita" style={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
        
        {/* Botón de Riego */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <button 
                onClick={handleRiego}
                disabled={regando || nivelCrecimiento >= 10}
                className="boton-riego"
                style={{ 
                    background: nivelCrecimiento >= 10 ? '#58cc02' : '#00C2CB', 
                    border: 'none', padding: '8px 24px', borderRadius: '12px', 
                    color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                    opacity: regando ? 0.7 : 1, cursor: nivelCrecimiento >= 10 ? 'default' : 'pointer',
                    boxShadow: '0 4px 0 rgba(0,0,0,0.2)', fontSize: '14px'
                }}
            >
                {nivelCrecimiento >= 10 ? (
                    <><span>🎉 Máximo</span></>
                ) : (
                    <>
                        <CloudRain size={20} /> 
                        <span>Regar</span>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '5px' }}>
                            <Gem size={12} /> {PRECIOS.lluvia}
                        </div>
                    </>
                )}
            </button>
        </div>

        {/* Grid de Tienda */}
        <div className="tienda-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
            <SelectorTienda 
                titulo="Gafas"
                nombre={NOMBRES_GAFAS[gafasIndex]}
                precio={PRECIOS.gafas[gafasIndex]}
                owned={inventarioGafas.includes(gafasIndex)}
                equipped={usuario.gafasId === gafasIndex}
                onPrev={() => cambiarItem('gafas', -1)}
                onNext={() => cambiarItem('gafas', 1)}
                onAction={() => handleAccionItem('gafas', gafasIndex, PRECIOS.gafas[gafasIndex])}
            />

            <SelectorTienda 
                titulo="Sombrero"
                nombre={NOMBRES_SOMBREROS[sombreroIndex]}
                precio={PRECIOS.sombreros[sombreroIndex]}
                owned={inventarioSombreros.includes(sombreroIndex)}
                equipped={usuario.sombreroId === sombreroIndex}
                onPrev={() => cambiarItem('sombrero', -1)}
                onNext={() => cambiarItem('sombrero', 1)}
                onAction={() => handleAccionItem('sombrero', sombreroIndex, PRECIOS.sombreros[sombreroIndex])}
            />

        </div>
      </div>
    </div>
  );
}

function SelectorTienda({ titulo, nombre, precio, owned, equipped, onPrev, onNext, onAction }) {
    return (
        <div style={{ background: 'var(--surface-2)', padding: '10px', borderRadius: '14px', border: '2px solid var(--border)', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: 'var(--text)', fontSize: '14px' }}>{titulo}</h4>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '0 5px' }}><ChevronLeft size={20} /></button>
                <span style={{ fontWeight: 'bold', color: 'var(--brand-blue)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>{nombre}</span>
                <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '0 5px' }}><ChevronRight size={20} /></button>
            </div>

            <button 
                onClick={onAction}
                disabled={equipped}
                style={{ 
                    width: '100%', padding: '8px', borderRadius: '10px', border: 'none', cursor: equipped ? 'default' : 'pointer',
                    background: equipped ? '#ccc' : (owned ? '#58cc02' : '#FFD700'),
                    color: owned ? 'white' : '#333',
                    fontWeight: 'bold', boxShadow: equipped ? 'none' : '0 3px 0 rgba(0,0,0,0.2)',
                    fontSize: '13px'
                }}
            >
                {equipped ? "Puesto" : (owned ? "Equipar" : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span>Comprar</span> <Gem size={14} /> {precio}
                    </div>
                ))}
            </button>
        </div>
    )
}