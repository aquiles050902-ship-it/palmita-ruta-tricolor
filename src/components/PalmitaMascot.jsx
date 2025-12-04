import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Agregamos la prop 'crecimiento' (default 0)
export default function PalmitaMascot({ width = 200, gafasId = 1, sombreroId = 0, tipoLluvia = 0, regando = false, crecimiento = 0 }) {
  const [cocoKey, setCocoKey] = useState(0); 

  useEffect(() => {
    if (regando) setCocoKey(prev => prev + 1);
  }, [regando]);

  const handleAnimationComplete = () => {
    if (!regando) setCocoKey(prevKey => prevKey + 1); 
  };

  // Cálculo de escala basado en crecimiento (0 a 10)
  // Nivel 0 = 40% del tamaño, Nivel 10 = 100% del tamaño
  const scaleFactor = 0.4 + (crecimiento * 0.06); 

  // === DIBUJOS DE SOMBREROS (1-10) ===
  const renderSombrero = () => {
    switch (sombreroId) {
      case 1: // Mago
        return <g><path d="M120 90 L180 90 L175 40 L125 40 Z" fill="#222" stroke="white" strokeWidth="2"/><rect x="110" y="90" width="80" height="10" rx="2" fill="#222" stroke="white"/><rect x="122" y="82" width="56" height="8" fill="#D32F2F"/></g>;
      case 2: // Corona
        return <g><path d="M110 90 L125 50 L140 80 L150 40 L160 80 L175 50 L190 90 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="3"/><circle cx="125" cy="50" r="3" fill="red"/><circle cx="150" cy="40" r="3" fill="blue"/><circle cx="175" cy="50" r="3" fill="red"/></g>;
      case 3: // Gorra
        return <g><path d="M120 90 A 30 30 0 0 1 180 90" fill="#0066FF" stroke="#0044AA" strokeWidth="2"/><rect x="110" y="85" width="80" height="10" rx="2" fill="#0066FF"/><rect x="160" y="85" width="40" height="4" fill="#333"/></g>;
      case 4: // Chef
        return <g><path d="M115 85 Q 110 30 150 30 Q 190 30 185 85 Z" fill="white" stroke="#ccc" strokeWidth="2"/><rect x="115" y="85" width="70" height="15" fill="white" stroke="#ccc"/></g>;
      case 5: // Vikingo
        return <g><path d="M120 90 A 30 30 0 0 1 180 90" fill="#777" stroke="#444"/><path d="M120 80 L 100 50 L 125 70" fill="#eee" stroke="#ccc"/><path d="M180 80 L 200 50 L 175 70" fill="#eee" stroke="#ccc"/></g>;
      case 6: // Graduación
        return <g><rect x="115" y="70" width="70" height="20" fill="#222"/><path d="M100 70 L150 55 L200 70 L150 85 Z" fill="#222" stroke="white"/><line x1="200" y1="70" x2="200" y2="110" stroke="#FFD700" strokeWidth="2"/><circle cx="200" cy="110" r="3" fill="#FFD700"/></g>;
      case 7: // Pirata
        return <g><path d="M110 90 Q 150 50 190 90 Z" fill="#111"/><path d="M100 90 L200 90 L190 70 L110 70 Z" fill="#111"/><circle cx="150" cy="80" r="5" fill="white"/><path d="M145 85 L155 95 M155 85 L145 95" stroke="white" strokeWidth="2"/></g>;
      case 8: // Fiesta
        return <g><path d="M130 90 L150 30 L170 90 Z" fill="#FF4081"/><circle cx="150" cy="30" r="5" fill="#FFD700"/><circle cx="140" cy="70" r="3" fill="yellow"/><circle cx="160" cy="50" r="3" fill="cyan"/></g>;
      case 9: // Vaquero
        return <g><ellipse cx="150" cy="85" rx="50" ry="10" fill="#8D6E63"/><path d="M125 85 L130 45 Q 150 40 170 45 L175 85 Z" fill="#6D4C41"/></g>;
      case 10: // Astronauta (Casco)
        return <g><circle cx="150" cy="150" r="55" fill="rgba(255,255,255,0.3)" stroke="#ccc" strokeWidth="2"/><rect x="140" y="200" width="20" height="10" fill="#ccc"/></g>;
      default: return null;
    }
  };

  // === DIBUJOS DE GAFAS (1-10) ===
  const renderGafas = () => {
    switch (gafasId) {
      case 1: // Hacker (Original)
        return <g><rect x="110" y="148" width="80" height="8" fill="#333" rx="2"/><rect x="115" y="152" width="28" height="18" fill="url(#hackerLensGradient)" rx="2"/><rect x="157" y="152" width="28" height="18" fill="url(#hackerLensGradient)" rx="2"/><rect x="143" y="150" width="14" height="6" fill="#333" rx="1"/></g>;
      case 2: // Sol Clásicas
        return <g><rect x="115" y="150" width="30" height="20" rx="5" fill="#222"/><rect x="155" y="150" width="30" height="20" rx="5" fill="#222"/><line x1="145" y1="160" x2="155" y2="160" stroke="#222" strokeWidth="3"/></g>;
      case 3: // Corazones
        return <g><path d="M115 160 Q115 140 130 150 Q145 140 145 160 L130 175 Z" fill="#E91E63"/><path d="M155 160 Q155 140 170 150 Q185 140 185 160 L170 175 Z" fill="#E91E63"/><line x1="140" y1="160" x2="160" y2="160" stroke="#E91E63" strokeWidth="2"/></g>;
      case 4: // Harry Potter
        return <g><circle cx="130" cy="160" r="12" fill="none" stroke="black" strokeWidth="3"/><circle cx="170" cy="160" r="12" fill="none" stroke="black" strokeWidth="3"/><line x1="142" y1="160" x2="158" y2="160" stroke="black" strokeWidth="2"/></g>;
      case 5: // 3D (Rojo/Azul)
        return <g><rect x="115" y="150" width="30" height="20" fill="rgba(255,0,0,0.5)" stroke="white"/><rect x="155" y="150" width="30" height="20" fill="rgba(0,0,255,0.5)" stroke="white"/><rect x="110" y="155" width="80" height="2" fill="white"/></g>;
      case 6: // Estrellas
        return <g><path d="M130 145 L135 170 L115 155 L145 155 L125 170 Z" fill="#FFEB3B"/><path d="M170 145 L175 170 L155 155 L185 155 L165 170 Z" fill="#FFEB3B"/></g>;
      case 7: // Monóculo
        return <g><circle cx="165" cy="160" r="14" fill="rgba(200,240,255,0.4)" stroke="#D4AF37" strokeWidth="2"/><path d="M179 160 Q 190 180 190 220" fill="none" stroke="#D4AF37" strokeWidth="1"/></g>;
      case 8: // Cíclope (Futurista)
        return <g><rect x="120" y="155" width="60" height="10" fill="#333" rx="2"/><rect x="125" y="157" width="50" height="6" fill="#f00" rx="1"/></g>;
      case 9: // Esquiador
        return <g><path d="M115 150 Q 150 140 185 150 L 180 170 Q 150 180 120 170 Z" fill="url(#hackerLensGradient)" stroke="#fff" strokeWidth="2"/></g>;
      case 10: // Pixel Retro
        return <g><rect x="115" y="150" width="10" height="10" fill="black"/><rect x="125" y="150" width="10" height="10" fill="black"/><rect x="135" y="150" width="10" height="10" fill="black"/><rect x="115" y="160" width="10" height="10" fill="black"/><rect x="125" y="160" width="10" height="10" fill="black"/><rect x="155" y="150" width="10" height="10" fill="black"/><rect x="165" y="150" width="10" height="10" fill="black"/><rect x="175" y="150" width="10" height="10" fill="black"/><rect x="155" y="160" width="10" height="10" fill="black"/><rect x="165" y="160" width="10" height="10" fill="black"/></g>;
      default: return null;
    }
  };

  const renderRain = (i) => {
    if (tipoLluvia === 1) { 
        return <div key={i} style={{ position: 'absolute', left: `${10 + i*18}%`, width: '6px', height: '15px', background: '#00C2CB', borderRadius: '10px' }}></div>
    } 
    return null;
  }

  return (
    <div style={{ width: width, height: width, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'visible', position: 'relative' }}>
      
      {regando && (
        <div style={{ position: 'absolute', top: -50, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
           {[...Array(6)].map((_, i) => (
             <motion.div 
               key={i}
               initial={{ y: -30, opacity: 0 }}
               animate={{ y: 200, opacity: [0, 1, 0] }}
               transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
             >
               {renderRain(i)}
             </motion.div>
           ))}
        </div>
      )}

      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <filter id="palmitaShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
          <linearGradient id="trunkBrown" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#8B4513"/><stop offset="100%" stopColor="#A0522D"/></linearGradient>
          <linearGradient id="leafGreen" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6BCB6C"/><stop offset="100%" stopColor="#4CAF50"/></linearGradient>
          <radialGradient id="cocoGradient" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#A0522D"/><stop offset="100%" stopColor="#5A2D0C"/></radialGradient>
          <linearGradient id="hackerLensGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00E676"/><stop offset="100%" stopColor="#1DE9B6"/></linearGradient>
        </defs>

        {/* GRUPO PRINCIPAL CON ESCALADO SEGÚN NIVEL */}
        <motion.g 
            filter="url(#palmitaShadow)"
            animate={{ scale: scaleFactor }} // AQUÍ OCURRE LA MAGIA DEL CRECIMIENTO
            style={{ transformOrigin: "bottom center" }} // Crece desde el suelo hacia arriba
        >
          <motion.g
            animate={regando ? { scale: [1, 1.05, 1], y: [0, -5, 0] } : { y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            onAnimationComplete={handleAnimationComplete}
            style={{ transformOrigin: "center bottom" }}
          >
            <path d="M110 250 Q 100 170 150 90 Q 200 170 190 250 Z" fill="url(#trunkBrown)" stroke="#6E380E" strokeWidth="8" strokeLinejoin="round"/>
            <g stroke="#388E3C" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" fill="url(#leafGreen)">
              <motion.path d="M140 95 Q 60 70 30 150 Q 80 120 140 95 Z" animate={{ rotate: [0, -8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} style={{ transformOrigin: "150px 95px" }} />
              <motion.path d="M160 95 Q 240 70 270 150 Q 220 120 160 95 Z" animate={{ rotate: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} style={{ transformOrigin: "150px 95px" }} />
              <motion.path d="M150 85 Q 150 30 185 50 Q 160 75 150 85 Z" animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
              <motion.path d="M140 90 Q 90 55 70 110 Q 110 85 140 90 Z" animate={{ rotate: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} style={{ transformOrigin: "150px 95px" }} />
              <motion.path d="M160 90 Q 210 55 230 110 Q 190 85 160 90 Z" animate={{ rotate: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} style={{ transformOrigin: "150px 95px" }} />
              <motion.path d="M145 98 Q 110 80 90 130 Q 120 110 145 98 Z" animate={{ rotate: [0, -4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} style={{ transformOrigin: "150px 95px" }} />
              <motion.path d="M155 98 Q 190 80 210 130 Q 180 110 155 98 Z" animate={{ rotate: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} style={{ transformOrigin: "150px 95px" }} />
            </g>
            <circle cx="150" cy="160" r="35" fill="white" stroke="#E0E0E0" strokeWidth="4" />
            <ellipse cx="130" cy="170" rx="8" ry="5" fill="#FFC0CB" opacity="0.8" />
            <ellipse cx="170" cy="170" rx="8" ry="5" fill="#FFC0CB" opacity="0.8" />
            <path d="M135 175 Q 150 185 165 175" fill="none" stroke="#6E380E" strokeWidth="4" strokeLinecap="round" />

            {/* RENDERIZAMOS LOS ACCESORIOS SELECCIONADOS */}
            {renderGafas()}
            {renderSombrero()}

          </motion.g>

          <motion.circle key={cocoKey} cx="140" cy="130" r="10" fill="url(#cocoGradient)" stroke="#5A2D0C" strokeWidth="2" initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 30, 200] }} transition={{ duration: 1.5 }} />
        </motion.g>
      </svg>
    </div>
  );
}