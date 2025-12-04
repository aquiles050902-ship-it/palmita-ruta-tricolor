import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Heart, RefreshCw } from "lucide-react";
import audio from '../utils/audio'; // <--- 1. IMPORTAMOS EL AUDIO

// === BASE DE DATOS DE PREGUNTAS (10 Niveles Educativos) ===
const QUESTIONS_DB = {
  1: {
    titulo: "Nivel 1: Algoritmos (El Orden)",
    instruccion: "Un algoritmo son pasos ordenados. Si cambias el orden, ¡sale mal! ¿Cuál es el orden correcto para cepillarse?",
    contenido: "🦷 Dientes Sucios ➡️ ✨ Dientes Limpios",
    opciones: [
      { id: "a", text: "1. Enjuagar ➝ 2. Secar ➝ 3. Poner Pasta" },
      { id: "b", text: "1. Poner Pasta ➝ 2. Cepillar ➝ 3. Enjuagar" }, // Correcta
      { id: "c", text: "1. Cepillar ➝ 2. Poner Pasta ➝ 3. Enjuagar" },
      { id: "d", text: "1. Secar ➝ 2. Enjuagar ➝ 3. Poner Pasta" }
    ],
    correcta: "b"
  },
  2: {
    titulo: "Nivel 2: Instrucciones Precisas",
    instruccion: "El robot no es inteligente, solo obedece. Mira hacia ARRIBA (Norte) y la meta está a la DERECHA (Este). ¿Qué le dices?",
    contenido: "🤖 ⬆️ ... (Meta: 🏁 ➡️)",
    opciones: [
      { id: "a", text: "Gira a la Izquierda (⬅️) y avanza" },
      { id: "b", text: "Sigue derecho (⬆️) sin parar" },
      { id: "c", text: "Gira a la Derecha (➡️) y avanza" }, // Correcta
      { id: "d", text: "Salta el muro (🦘)" }
    ],
    correcta: "c"
  },
  3: {
    titulo: "Nivel 3: Reconocer Patrones",
    instruccion: "Los programadores buscan cosas que se repiten. Descubre la regla y completa la serie:",
    contenido: "🍎 - 🍌 - 🍎 - 🍌 - ❓",
    opciones: [
      { id: "a", text: "🍎 Manzana" }, // Correcta
      { id: "b", text: "🍇 Uva" },
      { id: "c", text: "🍌 Banana" },
      { id: "d", text: "🍉 Sandía" }
    ],
    correcta: "a"
  },
  4: {
    titulo: "Nivel 4: Debugging (Depuración)",
    instruccion: "¡Alerta de Bug! Un 'Bug' es un error en el código. En esta rutina de desayuno, algo está fuera de lugar. ¿Qué es?",
    contenido: "1. Sacar plato vacío ➝ 2. Comer ➝ 3. Servir comida",
    opciones: [
      { id: "a", text: "Sacar el plato (El paso 1)" },
      { id: "b", text: "Comer antes de servir (El paso 2)" }, // Correcta
      { id: "c", text: "Servir la comida (El paso 3)" },
      { id: "d", text: "No hay ningún error, está perfecto" }
    ],
    correcta: "b"
  },
  5: {
    titulo: "Nivel 5: Causa y Efecto",
    instruccion: "Las computadoras reaccionan a eventos. SI el semáforo cambia a ROJO, ENTONCES los autos...",
    contenido: "🚗💨 ... 🚦🔴 ... ¿Qué pasa ahora?",
    opciones: [
      { id: "a", text: "Aceleran más rápido" },
      { id: "b", text: "Se detienen (Stop)" }, // Correcta
      { id: "c", text: "Vuelan por el aire" },
      { id: "d", text: "Tocan la bocina fuerte" }
    ],
    correcta: "b"
  },
  6: {
    titulo: "Nivel 6: Condicionales (Si...)",
    instruccion: "Una condicional es una regla: SI pasa esto, haz aquello. 'SI está lloviendo = VERDADERO', ¿qué necesitas?",
    contenido: "🌧️ Lluvia = ✅ (Verdad) ➝ ¿Objeto?",
    opciones: [
      { id: "a", text: "Unas gafas de sol 😎" },
      { id: "b", text: "Un paraguas ☔" }, // Correcta
      { id: "c", text: "Una regadera 🌻" },
      { id: "d", text: "Traje de baño 🩳" }
    ],
    correcta: "b"
  },
  7: {
    titulo: "Nivel 7: Bucles (Repetición)",
    instruccion: "Palmita quiere saltar 100 veces. Escribir 'Saltar' 100 veces es aburrido. ¿Cómo lo hace un programador?",
    contenido: "🦘 ... (x100 veces)",
    opciones: [
      { id: "a", text: "Escribir 'Saltar' 100 veces en la hoja" },
      { id: "b", text: "Usar un Bucle: 'Repetir 100 veces (Saltar)'" }, // Correcta
      { id: "c", text: "Saltar solo una vez y ya" },
      { id: "d", text: "Caminar en lugar de saltar" }
    ],
    correcta: "b"
  },
  8: {
    titulo: "Nivel 8: Tipos de Datos",
    instruccion: "Las computadoras no leen igual que tú. Diferencian TEXTO de NÚMEROS. ¿Cuál de estos es un NÚMERO puro?",
    contenido: "Caja de Datos: [ 'Hola', '10', 500, 'A' ]",
    opciones: [
      { id: "a", text: "'Hola' (Esto es texto)" },
      { id: "b", text: "'10' (Tiene comillas, es texto)" },
      { id: "c", text: "500 (Sin comillas, es número)" }, // Correcta
      { id: "d", text: "'A' (Es una letra)" }
    ],
    correcta: "c"
  },
  9: {
    titulo: "Nivel 9: Lógica Deductiva",
    instruccion: "Lee las pistas: 1. El Gato duerme. 2. El Ratón tiene hambre. 3. El Queso desapareció. ¿Quién se comió el queso?",
    contenido: "🐱💤 ... 🐭🍴 ... 🧀❓",
    opciones: [
      { id: "a", text: "El Gato (Estaba durmiendo)" },
      { id: "b", text: "El Ratón (Tenía hambre)" }, // Correcta
      { id: "c", text: "El Queso se comió solo" },
      { id: "d", text: "Palmita" }
    ],
    correcta: "b"
  },
  10: {
    titulo: "Nivel 10: ¿Qué es Programar?",
    instruccion: "¡Felicidades, llegaste al final! Para graduarte: ¿Cuál es la mejor definición de ser Programador?",
    contenido: "👨‍💻 ⌨️ 🌍",
    opciones: [
      { id: "a", text: "Saber arreglar impresoras y WiFi" },
      { id: "b", text: "Dar instrucciones para resolver problemas" }, // Correcta
      { id: "c", text: "Jugar videojuegos todo el día" },
      { id: "d", text: "Escribir muy rápido sin mirar" }
    ],
    correcta: "b"
  }
};

export default function QuizEngine({ alCerrar, alCompletar, nivelId = 1 }) {
  const preguntaActual = QUESTIONS_DB[nivelId] || QUESTIONS_DB[1];
  
  const [seleccion, setSeleccion] = useState(null);
  const [estado, setEstado] = useState("pendiente"); 
  const [vidas, setVidas] = useState(3); 

  useEffect(() => {
    setSeleccion(null);
    setEstado("pendiente");
    setVidas(3);
  }, [nivelId]);

  const comprobarRespuesta = () => {
    if (!seleccion || estado === 'correcto' || estado === 'revelado') return;

    if (seleccion === preguntaActual.correcta) {
      // --- GANASTE ---
      setEstado("correcto");
      audio.playSfx('success'); // <--- 2. SONIDO DE ÉXITO
    } else {
      // --- FALLASTE ---
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      audio.playSfx('error'); // <--- 3. SONIDO DE ERROR
      
      if (nuevasVidas > 0) {
        setEstado("error_intento");
        
        setTimeout(() => {
            setEstado("pendiente");
            setSeleccion(null); 
        }, 2000);

      } else {
        setEstado("revelado");
      }
    }
  };

  const avanzar = () => {
    alCompletar(true);
  };

  return (
    <div className="quiz-container">
      {/* Header Flotante (X y Vidas) */}
      <div className="quiz-header">
        <button className="btn-cerrar" onClick={alCerrar}>
          <X size={32} color="#aaa" />
        </button>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#ff4b4b', fontWeight: '800', fontSize: '22px' }}>
            <Heart fill={vidas > 0 ? "#ff4b4b" : "none"} size={30} /> 
            {vidas}
        </div>
      </div>

      {/* Contenido */}
      <div className="quiz-contenido">
        <h2 className="quiz-titulo">{preguntaActual.titulo}</h2>
        <p className="quiz-instruccion">{preguntaActual.instruccion}</p>
        
        <div className="quiz-visual"><span>{preguntaActual.contenido}</span></div>

        <div className="quiz-opciones">
          {preguntaActual.opciones.map((op, index) => {
            let claseExtra = "";
            
            if (seleccion === op.id) claseExtra = "seleccionada";
            
            if (estado === 'correcto' && op.id === preguntaActual.correcta) claseExtra = "correcta-verde";
            
            if (estado === 'error_intento' && seleccion === op.id) claseExtra = "error";

            if (estado === 'revelado') {
                if (op.id === preguntaActual.correcta) claseExtra = "correcta-verde";
                else if (seleccion === op.id) claseExtra = "error";
            }

            return (
              <motion.div
                key={op.id}
                whileTap={{ scale: 0.98 }}
                className={`opcion-card ${claseExtra}`}
                onClick={() => {
                  if (estado === 'pendiente') {
                    setSeleccion(op.id);
                    audio.playSfx('click'); // <--- 4. OPCIONAL: SONIDO AL SELECCIONAR
                  }
                }}
              >
                <div className="letra-opcion">{index + 1}</div>
                <div className="texto-opcion">{op.text}</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className={`quiz-footer ${estado === 'error_intento' ? 'error' : (estado === 'correcto' || estado === 'revelado' ? 'correcto' : '')}`}>
        
        <div className="mensaje-feedback">
          {estado === 'correcto' && (
            <div className="feedback-content exito">
                <CheckCircle size={40} fill="#58cc02" color="white" />
                <div><h3>¡Correcto!</h3><p>Has pasado el nivel.</p></div>
            </div>
          )}
          
          {estado === 'error_intento' && (
            <div className="feedback-content error">
                <AlertCircle size={40} fill="#ff4b4b" color="white" />
                <div>
                    <h3>¡Casi!</h3>
                    <p>Pierdes un corazón 💔. Intenta otra vez.</p>
                </div>
            </div>
          )}

          {estado === 'revelado' && (
            <div className="feedback-content error">
                <RefreshCw size={40} color="white" />
                <div>
                    <h3>¡Oh no, sin vidas!</h3>
                    <p>La respuesta correcta era la marcada.</p>
                </div>
            </div>
          )}
        </div>

        {/* BOTÓN DE ACCIÓN */}
        { (estado === 'correcto' || estado === 'revelado') ? (
            <button className="btn-comprobar correcto" onClick={avanzar}>CONTINUAR</button>
        ) : (
            <button 
                className={`btn-comprobar ${estado === 'error_intento' ? 'error' : ''}`} 
                onClick={comprobarRespuesta}
                disabled={estado === 'error_intento'} 
            >
                {estado === 'error_intento' ? 'ESPERA...' : 'COMPROBAR'}
            </button>
        )}
      </div>
    </div>
  );
}