import { motion } from "framer-motion";
import { useState } from "react";

export default function PalmitaMascot({ width = 200 }) {
  const [cocoKey, setCocoKey] = useState(0); 

  const handleAnimationComplete = () => {
    setCocoKey(prevKey => prevKey + 1); 
  };

  return (
    <div style={{ width: width, height: width, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <filter id="palmitaShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>

          <linearGradient id="trunkBrown" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#A0522D" />
          </linearGradient>

          <linearGradient id="leafGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6BCB6C" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>

          <radialGradient id="cocoGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#5A2D0C" />
          </radialGradient>

          {/* Degradado para las lentes de las gafas */}
          <linearGradient id="hackerLensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E676" /> {/* Verde brillante */}
            <stop offset="100%" stopColor="#1DE9B6" /> {/* Azul turquesa */}
          </linearGradient>

        </defs>

        <g filter="url(#palmitaShadow)">
          {/* === PALMITA PRINCIPAL === */}
          <motion.g
            animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            onAnimationComplete={handleAnimationComplete}
            style={{ transformOrigin: "center bottom" }}
          >
            {/* Tronco Más Grande y Robusto */}
            <path 
              d="M110 250 Q 100 170 150 90 Q 200 170 190 250 Z" 
              fill="url(#trunkBrown)" stroke="#6E380E" strokeWidth="8" strokeLinejoin="round"
            />

            {/* HOJAS MÁS FRONDOSAS */}
            <g stroke="#388E3C" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" fill="url(#leafGreen)">
              {/* Hoja izquierda trasera grande */}
              <motion.path 
                d="M140 95 Q 60 70 30 150 Q 80 120 140 95 Z"
                animate={{ rotate: [0, -8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                style={{ transformOrigin: "150px 95px" }}
              />
              {/* Hoja derecha trasera grande */}
              <motion.path 
                d="M160 95 Q 240 70 270 150 Q 220 120 160 95 Z" 
                animate={{ rotate: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                style={{ transformOrigin: "150px 95px" }}
              />
              {/* Hoja central superior */}
              <motion.path 
                d="M150 85 Q 150 30 185 50 Q 160 75 150 85 Z" 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              {/* Hoja izquierda media */}
              <motion.path 
                d="M140 90 Q 90 55 70 110 Q 110 85 140 90 Z" 
                animate={{ rotate: [0, -6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                style={{ transformOrigin: "150px 95px" }}
              />
              {/* Hoja derecha media */}
              <motion.path 
                d="M160 90 Q 210 55 230 110 Q 190 85 160 90 Z" 
                animate={{ rotate: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                style={{ transformOrigin: "150px 95px" }}
              />
              {/* Hoja frontal izquierda (superpuesta) */}
              <motion.path 
                d="M145 98 Q 110 80 90 130 Q 120 110 145 98 Z" 
                animate={{ rotate: [0, -4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                style={{ transformOrigin: "150px 95px" }}
              />
              {/* Hoja frontal derecha (superpuesta) */}
              <motion.path 
                d="M155 98 Q 190 80 210 130 Q 180 110 155 98 Z" 
                animate={{ rotate: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                style={{ transformOrigin: "150px 95px" }}
              />
            </g>

            {/* CARA */}
            <circle cx="150" cy="160" r="35" fill="white" stroke="#E0E0E0" strokeWidth="4" />
            
            {/* Rubor en las mejillas */}
            <ellipse cx="130" cy="170" rx="8" ry="5" fill="#FFC0CB" opacity="0.8" />
            <ellipse cx="170" cy="170" rx="8" ry="5" fill="#FFC0CB" opacity="0.8" />

            {/* === GAFAS DE HACKER (PIXEL ART) === */}
            <g className="hacker-glasses">
              {/* Marco Superior */}
              <rect x="110" y="148" width="80" height="8" fill="#333" rx="2" ry="2" />
              {/* Lente Izquierda */}
              <rect x="115" y="152" width="28" height="18" fill="url(#hackerLensGradient)" rx="2" ry="2" />
              {/* Lente Derecha */}
              <rect x="157" y="152" width="28" height="18" fill="url(#hackerLensGradient)" rx="2" ry="2" />
              {/* Puente */}
              <rect x="143" y="150" width="14" height="6" fill="#333" rx="1" ry="1" />
              {/* Patilla Izquierda (sólo un trozo visible) */}
              <rect x="105" y="155" width="8" height="4" fill="#333" rx="1" ry="1" />
              {/* Patilla Derecha (sólo un trozo visible) */}
              <rect x="187" y="155" width="8" height="4" fill="#333" rx="1" ry="1" />
            </g>

            {/* Boca sonriente */}
            <path d="M135 175 Q 150 185 165 175" fill="none" stroke="#6E380E" strokeWidth="4" strokeLinecap="round" />
          </motion.g>

          {/* === COCOS CAYENDO === */}
          <motion.circle 
            key={cocoKey} cx="140" cy="130" r="10" fill="url(#cocoGradient)" stroke="#5A2D0C" strokeWidth="2"
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, 30, 180, 220], x: [0, -10, -20, -25] }}
            transition={{ duration: 2, ease: "easeIn", delay: 1.8 }}
          />
          <motion.circle 
            key={cocoKey + 1} cx="160" cy="135" r="9" fill="url(#cocoGradient)" stroke="#5A2D0C" strokeWidth="2"
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, 25, 190, 230], x: [0, 10, 20, 25] }}
            transition={{ duration: 2.2, ease: "easeIn", delay: 2.0 }}
          />
        </g>
      </svg>
    </div>
  );
}