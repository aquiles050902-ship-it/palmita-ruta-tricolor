import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Heart, RefreshCw, Frown } from "lucide-react";
import audio from '../utils/audio';

// === BASE DE DATOS: 20 NIVELES x 5 VARIANTES CADA UNO (100 PREGUNTAS TOTAL) ===
const QUESTIONS_DB = {
  // --- NIVEL 1: ALGORITMOS (SECUENCIAS) ---
  1: [
    { titulo: "Nivel 1: Algoritmos", instruccion: "¿Cuál es el orden para cepillarse?", contenido: "🦷 Dientes Sucios ➡️ ✨ Limpios", opciones: [{ id: "a", text: "Enjuagar -> Secar -> Pasta" }, { id: "b", text: "Pasta -> Cepillar -> Enjuagar" }, { id: "c", text: "Cepillar -> Pasta -> Enjuagar" }, { id: "d", text: "Secar -> Enjuagar -> Pasta" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Pasos para preparar Cereal:", contenido: "🥣 Tazón Vacio ➡️ 😋 Cereal Listo", opciones: [{ id: "a", text: "Comer -> Leche -> Cereal" }, { id: "b", text: "Cereal -> Leche -> Comer" }, { id: "c", text: "Leche -> Comer -> Cereal" }, { id: "d", text: "Lavar -> Comer -> Servir" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "¿Qué va primero al vestirse?", contenido: "🦶 Pies ➡️ 👟 Zapatos", opciones: [{ id: "a", text: "Zapatos -> Medias" }, { id: "b", text: "Medias -> Zapatos" }, { id: "c", text: "Cordones -> Medias" }, { id: "d", text: "Zapatos -> Cortar uñas" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Algoritmo para una planta:", contenido: "🌱 Semilla ➡️ 🌻 Flor", opciones: [{ id: "a", text: "Agua -> Esperar -> Sembrar" }, { id: "b", text: "Cosechar -> Sembrar -> Regar" }, { id: "c", text: "Sembrar -> Regar -> Esperar" }, { id: "d", text: "Esperar -> Sembrar -> Regar" }], correcta: "c" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Lavarse las manos:", contenido: "🦠 Sucias ➡️ ✨ Limpias", opciones: [{ id: "a", text: "Mojar -> Jabón -> Frotar -> Enjuagar" }, { id: "b", text: "Secar -> Mojar -> Jabón" }, { id: "c", text: "Jabón -> Secar -> Mojar" }, { id: "d", text: "Frotar -> Secar -> Mojar" }], correcta: "a" }
  ],

  // --- NIVEL 2: INSTRUCCIONES PRECISAS ---
  2: [
    { titulo: "Nivel 2: Instrucciones", instruccion: "Robot mira al NORTE (⬆️). Meta al ESTE (➡️).", contenido: "🤖 ⬆️ ... 🏁 ➡️", opciones: [{ id: "a", text: "Girar Izquierda" }, { id: "b", text: "Seguir Derecho" }, { id: "c", text: "Girar Derecha" }, { id: "d", text: "Saltar" }], correcta: "c" },
    { titulo: "Nivel 2: Instrucciones", instruccion: "El dron mira al SUR (⬇️). Meta al OESTE (⬅️).", contenido: "🚁 ⬇️ ... 🏁 ⬅️", opciones: [{ id: "a", text: "Girar Derecha" }, { id: "b", text: "Girar Izquierda" }, { id: "c", text: "Subir" }, { id: "d", text: "Retroceder" }], correcta: "a" }, 
    { titulo: "Nivel 2: Instrucciones", instruccion: "Palmita mira a la Derecha (➡️). Quiere ir Arriba (⬆️).", contenido: "🌴 ➡️ ... 🏁 ⬆️", opciones: [{ id: "a", text: "Girar Izquierda" }, { id: "b", text: "Girar Derecha" }, { id: "c", text: "Caminar" }, { id: "d", text: "Agacharse" }], correcta: "a" },
    { titulo: "Nivel 2: Instrucciones", instruccion: "Estás en el piso 1. Quieres ir al piso 3.", contenido: "Elevador: 1️⃣ ... 3️⃣", opciones: [{ id: "a", text: "Presionar 'Bajar'" }, { id: "b", text: "Presionar 'Subir' 2 veces" }, { id: "c", text: "Abrir puerta" }, { id: "d", text: "Saltar" }], correcta: "b" },
    { titulo: "Nivel 2: Instrucciones", instruccion: "El coche va recto. Hay un muro enfrente.", contenido: "🚗 💨 🧱", opciones: [{ id: "a", text: "Acelerar" }, { id: "b", text: "Frenar y Girar" }, { id: "c", text: "Tocar bocina" }, { id: "d", text: "Encender luces" }], correcta: "b" }
  ],

  // --- NIVEL 3: PATRONES ---
  3: [
    { titulo: "Nivel 3: Patrones", instruccion: "Completa la serie:", contenido: "🍎 - 🍌 - 🍎 - 🍌 - ❓", opciones: [{ id: "a", text: "🍎 Manzana" }, { id: "b", text: "🍇 Uva" }, { id: "c", text: "🍌 Banana" }, { id: "d", text: "🍉 Sandía" }], correcta: "a" },
    { titulo: "Nivel 3: Patrones", instruccion: "¿Qué sigue?", contenido: "🔺 🟦 🔺 🟦 ❓", opciones: [{ id: "a", text: "🟢 Círculo" }, { id: "b", text: "🔺 Triángulo" }, { id: "c", text: "🟦 Cuadrado" }, { id: "d", text: "⭐ Estrella" }], correcta: "b" },
    { titulo: "Nivel 3: Patrones", instruccion: "Descubre la regla:", contenido: "1, 2, 1, 2, 1, ❓", opciones: [{ id: "a", text: "1" }, { id: "b", text: "3" }, { id: "c", text: "2" }, { id: "d", text: "0" }], correcta: "c" },
    { titulo: "Nivel 3: Patrones", instruccion: "Patrón de música:", contenido: "🥁 🎸 🥁 🎸 ❓", opciones: [{ id: "a", text: "🎹 Piano" }, { id: "b", text: "🎸 Guitarra" }, { id: "c", text: "🥁 Tambor" }, { id: "d", text: "🎻 Violín" }], correcta: "c" },
    { titulo: "Nivel 3: Patrones", instruccion: "Día y Noche:", contenido: "☀️ 🌙 ☀️ 🌙 ❓", opciones: [{ id: "a", text: "☁️ Nube" }, { id: "b", text: "☀️ Sol" }, { id: "c", text: "🌙 Luna" }, { id: "d", text: "🌧️ Lluvia" }], correcta: "b" }
  ],

  // --- NIVEL 4: DEBUGGING (ERRORES) ---
  4: [
    { titulo: "Nivel 4: Debugging", instruccion: "Encuentra el Bug (Error):", contenido: "1. Sacar plato ➝ 2. Comer ➝ 3. Servir comida", opciones: [{ id: "a", text: "Paso 1" }, { id: "b", text: "Paso 2 (Comer antes de servir)" }, { id: "c", text: "Paso 3" }, { id: "d", text: "Ninguno" }], correcta: "b" },
    { titulo: "Nivel 4: Debugging", instruccion: "El robot choca contra la pared. ¿Por qué?", contenido: "Código: Caminar_Siempre()", opciones: [{ id: "a", text: "Falta instrucción 'Girar si hay pared'" }, { id: "b", text: "El robot es malo" }, { id: "c", text: "La pared se movió" }, { id: "d", text: "Está cansado" }], correcta: "a" },
    { titulo: "Nivel 4: Debugging", instruccion: "La luz no enciende.", contenido: "1. Comprar bombillo ➝ 2. Tirarlo a la basura ➝ 3. Encender", opciones: [{ id: "a", text: "Comprar bombillo" }, { id: "b", text: "Tirarlo a la basura" }, { id: "c", text: "Encender" }, { id: "d", text: "Todo bien" }], correcta: "b" },
    { titulo: "Nivel 4: Debugging", instruccion: "Error en la suma:", contenido: "2 + 2 = 5", opciones: [{ id: "a", text: "El resultado debería ser 3" }, { id: "b", text: "El resultado debería ser 4" }, { id: "c", text: "El 2 está mal escrito" }, { id: "d", text: "Es correcto" }], correcta: "b" },
    { titulo: "Nivel 4: Debugging", instruccion: "El videojuego no inicia.", contenido: "Código: Iniciar_Juego = FALSO", opciones: [{ id: "a", text: "Cambiar a VERDADERO" }, { id: "b", text: "Borrar el juego" }, { id: "c", text: "Apagar pantalla" }, { id: "d", text: "Gritar" }], correcta: "a" }
  ],

  // --- NIVEL 5: EVENTOS (CAUSA-EFECTO) ---
  5: [
    { titulo: "Nivel 5: Eventos", instruccion: "SI Semáforo = ROJO, ENTONCES:", contenido: "🚗💨 ... 🚦🔴", opciones: [{ id: "a", text: "Acelerar" }, { id: "b", text: "Detenerse" }, { id: "c", text: "Volar" }, { id: "d", text: "Pitar" }], correcta: "b" },
    { titulo: "Nivel 5: Eventos", instruccion: "SI tocas fuego, ENTONCES:", contenido: "🔥 + ✋ =", opciones: [{ id: "a", text: "Te congelas" }, { id: "b", text: "Te quemas (Daño)" }, { id: "c", text: "Ganas superpoderes" }, { id: "d", text: "Nada" }], correcta: "b" },
    { titulo: "Nivel 5: Eventos", instruccion: "SI presionas 'A' en el juego, Mario:", contenido: "🎮 Botón A", opciones: [{ id: "a", text: "Se agacha" }, { id: "b", text: "Salta" }, { id: "c", text: "Se duerme" }, { id: "d", text: "Se apaga" }], correcta: "b" },
    { titulo: "Nivel 5: Eventos", instruccion: "SI suena la alarma, ENTONCES:", contenido: "⏰ Riiiing!", opciones: [{ id: "a", text: "Seguir durmiendo" }, { id: "b", text: "Despertarse" }, { id: "c", text: "Comer" }, { id: "d", text: "Bailar" }], correcta: "b" },
    { titulo: "Nivel 5: Eventos", instruccion: "SI batería < 1%, ENTONCES:", contenido: "📱 🪫", opciones: [{ id: "a", text: "El celular se apaga" }, { id: "b", text: "El celular explota" }, { id: "c", text: "Se carga solo" }, { id: "d", text: "Llama a mamá" }], correcta: "a" }
  ],

  // --- NIVEL 6: CONDICIONALES ---
  6: [
    { titulo: "Nivel 6: Condicionales", instruccion: "SI llueve = VERDADERO, ¿qué llevas?", contenido: "🌧️ Lluvia = ✅", opciones: [{ id: "a", text: "Gafas de sol" }, { id: "b", text: "Paraguas" }, { id: "c", text: "Regadera" }, { id: "d", text: "Bañador" }], correcta: "b" },
    { titulo: "Nivel 6: Condicionales", instruccion: "SI tienes hambre, ¿qué haces?", contenido: "😋 Hambre = SI", opciones: [{ id: "a", text: "Dormir" }, { id: "b", text: "Comer" }, { id: "c", text: "Jugar" }, { id: "d", text: "Correr" }], correcta: "b" },
    { titulo: "Nivel 6: Condicionales", instruccion: "SI puerta cerrada, ENTONCES:", contenido: "🚪🔒", opciones: [{ id: "a", text: "Entrar caminando" }, { id: "b", text: "Usar llave o tocar" }, { id: "c", text: "Volar" }, { id: "d", text: "Nada" }], correcta: "b" },
    { titulo: "Nivel 6: Condicionales", instruccion: "SI es de noche, ENTONCES:", contenido: "🌃", opciones: [{ id: "a", text: "Encender luces" }, { id: "b", text: "Ponerse gafas oscuras" }, { id: "c", text: "Desayunar" }, { id: "d", text: "Ir a la playa" }], correcta: "a" },
    { titulo: "Nivel 6: Condicionales", instruccion: "SI Nota >= 10, ENTONCES:", contenido: "📝 Examen", opciones: [{ id: "a", text: "Reprobado" }, { id: "b", text: "Aprobado" }, { id: "c", text: "Expulsado" }, { id: "d", text: "Castigado" }], correcta: "b" }
  ],

  // --- NIVEL 7: BUCLES (REPETICIÓN) ---
  7: [
    { titulo: "Nivel 7: Bucles", instruccion: "Saltar 100 veces. ¿Cómo se escribe mejor?", contenido: "🦘 x100", opciones: [{ id: "a", text: "Escribir 'Saltar' 100 veces" }, { id: "b", text: "Repetir 100 veces (Saltar)" }, { id: "c", text: "Saltar 1 vez" }, { id: "d", text: "Caminar" }], correcta: "b" },
    { titulo: "Nivel 7: Bucles", instruccion: "Lavar 5 platos sucios.", contenido: "🍽️🍽️🍽️🍽️🍽️", opciones: [{ id: "a", text: "Lavar 1 y dejar 4" }, { id: "b", text: "Repetir 5 veces (Lavar plato)" }, { id: "c", text: "Romper platos" }, { id: "d", text: "Mirarlos" }], correcta: "b" },
    { titulo: "Nivel 7: Bucles", instruccion: "Caminar hasta la pared.", contenido: "🚶 ... 🧱", opciones: [{ id: "a", text: "Dar 1 paso" }, { id: "b", text: "Repetir (Caminar) HASTA chocar" }, { id: "c", text: "Sentarse" }, { id: "d", text: "Correr en círculos" }], correcta: "b" },
    { titulo: "Nivel 7: Bucles", instruccion: "Martillar un clavo.", contenido: "🔨 🔩", opciones: [{ id: "a", text: "Golpear 1 vez suave" }, { id: "b", text: "Repetir (Golpear) HASTA que entre" }, { id: "c", text: "Gritarle al clavo" }, { id: "d", text: "Usar pegamento" }], correcta: "b" },
    { titulo: "Nivel 7: Bucles", instruccion: "Bucle Infinito (Error). ¿Cuál nunca termina?", contenido: "♾️", opciones: [{ id: "a", text: "Repetir 10 veces" }, { id: "b", text: "Repetir HASTA meta" }, { id: "c", text: "Repetir POR SIEMPRE" }, { id: "d", text: "Repetir 0 veces" }], correcta: "c" }
  ],

  // --- NIVEL 8: TIPOS DE DATOS ---
  8: [
    { titulo: "Nivel 8: Datos", instruccion: "¿Cuál es un NÚMERO?", contenido: "[ 'Hola', '10', 500, 'A' ]", opciones: [{ id: "a", text: "'Hola'" }, { id: "b", text: "'10' (Texto)" }, { id: "c", text: "500 (Número)" }, { id: "d", text: "'A'" }], correcta: "c" },
    { titulo: "Nivel 8: Datos", instruccion: "¿Cuál es un TEXTO (String)?", contenido: "🔤", opciones: [{ id: "a", text: "100" }, { id: "b", text: "\"Hola Mundo\"" }, { id: "c", text: "VERDADERO" }, { id: "d", text: "FALSO" }], correcta: "b" },
    { titulo: "Nivel 8: Datos", instruccion: "¿Cuál es un BOOLEANO?", contenido: "✅ / ❌", opciones: [{ id: "a", text: "55" }, { id: "b", text: "Azul" }, { id: "c", text: "VERDADERO" }, { id: "d", text: "Gato" }], correcta: "c" },
    { titulo: "Nivel 8: Datos", instruccion: "Si sumas Texto + Texto: 'Hola' + 'Pepe'", contenido: "➕", opciones: [{ id: "a", text: "HolaPepe (Se unen)" }, { id: "b", text: "Cero" }, { id: "c", text: "Error" }, { id: "d", text: "Resta" }], correcta: "a" },
    { titulo: "Nivel 8: Datos", instruccion: "¿Qué tipo de dato es tu edad?", contenido: "🎂 10", opciones: [{ id: "a", text: "Texto" }, { id: "b", text: "Número Entero" }, { id: "c", text: "Booleano" }, { id: "d", text: "Imagen" }], correcta: "b" }
  ],

  // --- NIVEL 9: LÓGICA DEDUCTIVA ---
  9: [
    { titulo: "Nivel 9: Lógica", instruccion: "1. Gato duerme. 2. Ratón come. 3. Queso falta. ¿Quién fue?", contenido: "🧀❓", opciones: [{ id: "a", text: "El Gato" }, { id: "b", text: "El Ratón" }, { id: "c", text: "El Perro" }, { id: "d", text: "Palmita" }], correcta: "b" },
    { titulo: "Nivel 9: Lógica", instruccion: "Ana es más alta que Luis. Luis es más alto que Pepe. ¿Quién es más bajo?", contenido: "📏", opciones: [{ id: "a", text: "Ana" }, { id: "b", text: "Luis" }, { id: "c", text: "Pepe" }, { id: "d", text: "Todos iguales" }], correcta: "c" },
    { titulo: "Nivel 9: Lógica", instruccion: "Todos los pájaros vuelan. Piolín es pájaro.", contenido: "🐦", opciones: [{ id: "a", text: "Piolín nada" }, { id: "b", text: "Piolín vuela" }, { id: "c", text: "Piolín ladra" }, { id: "d", text: "No se sabe" }], correcta: "b" },
    { titulo: "Nivel 9: Lógica", instruccion: "Si NO es lunes y NO es martes... y mañana es Jueves. ¿Qué día es?", contenido: "📅", opciones: [{ id: "a", text: "Domingo" }, { id: "b", text: "Miércoles" }, { id: "c", text: "Viernes" }, { id: "d", text: "Sábado" }], correcta: "b" },
    { titulo: "Nivel 9: Lógica", instruccion: "Tengo 4 patas y ladro. NO soy gato.", contenido: "🐶", opciones: [{ id: "a", text: "Vaca" }, { id: "b", text: "Perro" }, { id: "c", text: "Gato" }, { id: "d", text: "Pez" }], correcta: "b" }
  ],

  // --- NIVEL 10: CONCEPTO PROGRAMADOR ---
  10: [
    { titulo: "Nivel 10: Fin", instruccion: "¿Qué hace un programador?", contenido: "👨‍💻", opciones: [{ id: "a", text: "Arreglar WiFi" }, { id: "b", text: "Dar instrucciones lógicas" }, { id: "c", text: "Jugar todo el día" }, { id: "d", text: "Escribir sin pensar" }], correcta: "b" },
    { titulo: "Nivel 10: Fin", instruccion: "El lenguaje que entienden las computadoras es:", contenido: "010101", opciones: [{ id: "a", text: "Español" }, { id: "b", text: "Código Binario" }, { id: "c", text: "Inglés" }, { id: "d", text: "Francés" }], correcta: "b" },
    { titulo: "Nivel 10: Fin", instruccion: "¿Dónde escribimos el código?", contenido: "💻", opciones: [{ id: "a", text: "En Word" }, { id: "b", text: "En un Editor de Código" }, { id: "c", text: "En Paint" }, { id: "d", text: "En Instagram" }], correcta: "b" },
    { titulo: "Nivel 10: Fin", instruccion: "Si el código falla, tú...", contenido: "❌ Error", opciones: [{ id: "a", text: "Lloras y te vas" }, { id: "b", text: "Lo arreglas (Depuras)" }, { id: "c", text: "Rompes la PC" }, { id: "d", text: "Lo borras todo" }], correcta: "b" },
    { titulo: "Nivel 10: Fin", instruccion: "Programar sirve para:", contenido: "🌍", opciones: [{ id: "a", text: "Crear soluciones y juegos" }, { id: "b", text: "Solo sumar números" }, { id: "c", text: "Nada útil" }, { id: "d", text: "Perder tiempo" }], correcta: "a" }
  ],

  // --- NIVEL 11: BUCLES ANIDADOS ---
  11: [
    { titulo: "Nivel 11: Reloj", instruccion: "Un reloj tiene horas y minutos. ¿Cómo funciona?", contenido: "⏰ Bucle dentro de bucle", opciones: [{ id: "a", text: "Por cada Hora, giran 60 Minutos" }, { id: "b", text: "Giran las horas y luego los minutos" }, { id: "c", text: "Solo giran los segundos" }, { id: "d", text: "Todo gira al azar" }], correcta: "a" },
    { titulo: "Nivel 11: Calendario", instruccion: "Para pasar un año:", contenido: "📅", opciones: [{ id: "a", text: "Repetir 12 meses (Repetir 30 días)" }, { id: "b", text: "Repetir 365 meses" }, { id: "c", text: "Repetir 1 día" }, { id: "d", text: "No se repite nada" }], correcta: "a" },
    { titulo: "Nivel 11: Pintar Edificio", instruccion: "Pintar un edificio de ventanas.", contenido: "🏢", opciones: [{ id: "a", text: "Pintar 1 ventana y ya" }, { id: "b", text: "Por cada Piso (Pintar todas las Ventanas)" }, { id: "c", text: "Pintar el piso del suelo" }, { id: "d", text: "Tirar pintura" }], correcta: "b" },
    { titulo: "Nivel 11: Tablas de Multiplicar", instruccion: "Imprimir tablas del 1 al 10.", contenido: "✖️", opciones: [{ id: "a", text: "Escribir 100 números" }, { id: "b", text: "Por cada número (1-10), multiplicar por (1-10)" }, { id: "c", text: "Sumar todo" }, { id: "d", text: "Solo tabla del 1" }], correcta: "b" },
    { titulo: "Nivel 11: Correr en Pista", instruccion: "3 corredores dan 4 vueltas.", contenido: "🏃🏃🏃 🔄", opciones: [{ id: "a", text: "Por cada Corredor (Dar 4 vueltas)" }, { id: "b", text: "Todos dan 1 vuelta" }, { id: "c", text: "Corren en línea recta" }, { id: "d", text: "Nadie corre" }], correcta: "a" }
  ],

  // --- NIVEL 12: VARIABLES ---
  12: [
    { titulo: "Nivel 12: Variables", instruccion: "Tienes una caja llamada 'Puntos'. Empieza en 0. Ganas 10.", contenido: "📦 Puntos = 0 ➝ +10", opciones: [{ id: "a", text: "Puntos sigue siendo 0" }, { id: "b", text: "Puntos ahora vale 10" }, { id: "c", text: "La caja se rompe" }, { id: "d", text: "Puntos vale 100" }], correcta: "b" },
    { titulo: "Nivel 12: Variables", instruccion: "Vida = 100. Te golpean (-20).", contenido: "❤️ 100 - 20", opciones: [{ id: "a", text: "Vida = 80" }, { id: "b", text: "Vida = 120" }, { id: "c", text: "Vida = 0" }, { id: "d", text: "Vida = 20" }], correcta: "a" },
    { titulo: "Nivel 12: Variables", instruccion: "Nombre = 'Juan'. Luego Nombre = 'Pedro'.", contenido: "🏷️ Cambiar etiqueta", opciones: [{ id: "a", text: "Ahora se llama JuanPedro" }, { id: "b", text: "Ahora se llama Pedro" }, { id: "c", text: "Se llama Juan" }, { id: "d", text: "No tiene nombre" }], correcta: "b" },
    { titulo: "Nivel 12: Asignación", instruccion: "X = 5. Y = X + 2.", contenido: "❓ ¿Cuánto vale Y?", opciones: [{ id: "a", text: "5" }, { id: "b", text: "2" }, { id: "c", text: "7" }, { id: "d", text: "10" }], correcta: "c" },
    { titulo: "Nivel 12: Contador", instruccion: "Contador = Contador + 1. (Repetir 3 veces)", contenido: "Empezó en 0", opciones: [{ id: "a", text: "1" }, { id: "b", text: "3" }, { id: "c", text: "0" }, { id: "d", text: "10" }], correcta: "b" }
  ],

  // --- NIVEL 13: OPERADORES LÓGICOS ---
  13: [
    { titulo: "Nivel 13: Lógica Y (AND)", instruccion: "Para jugar necesitas: Tarea lista Y Cuarto limpio.", contenido: "Tarea=✅ Y Cuarto=❌", opciones: [{ id: "a", text: "Puedes jugar" }, { id: "b", text: "NO puedes jugar" }, { id: "c", text: "Juegas un rato" }, { id: "d", text: "Te vas a dormir" }], correcta: "b" },
    { titulo: "Nivel 13: Lógica O (OR)", instruccion: "Pasas si sacas 20 O si el profesor es bueno.", contenido: "Nota=10 O ProfeBueno=✅", opciones: [{ id: "a", text: "Pasas (Verdadero)" }, { id: "b", text: "No pasas" }, { id: "c", text: "Repites año" }, { id: "d", text: "Lloras" }], correcta: "a" },
    { titulo: "Nivel 13: Login", instruccion: "Usuario correcto Y Clave correcta.", contenido: "Usuario=Bien, Clave=Mal", opciones: [{ id: "a", text: "Entras al sistema" }, { id: "b", text: "Error de acceso" }, { id: "c", text: "Se abre Facebook" }, { id: "d", text: "Nada" }], correcta: "b" },
    { titulo: "Nivel 13: Ropa", instruccion: "Uso abrigo si: Hace Frío O Llueve.", contenido: "Hace Sol Y No Llueve", opciones: [{ id: "a", text: "Uso abrigo" }, { id: "b", text: "No uso abrigo" }, { id: "c", text: "Uso bufanda" }, { id: "d", text: "Me mojo" }], correcta: "b" },
    { titulo: "Nivel 13: Compra", instruccion: "Compro si: Tengo Dinero Y Hay Stock.", contenido: "Dinero=✅ Y Stock=✅", opciones: [{ id: "a", text: "Compro" }, { id: "b", text: "No compro" }, { id: "c", text: "Me lo regalan" }, { id: "d", text: "Robo" }], correcta: "a" }
  ],

  // --- NIVEL 14: FUNCIONES ---
  14: [
    { titulo: "Nivel 14: Funciones", instruccion: "Creas una función 'Saltar()'. ¿Qué hace?", contenido: "📦 [Agacharse + Impulso]", opciones: [{ id: "a", text: "Nada hasta que la llames" }, { id: "b", text: "Ejecuta los pasos guardados" }, { id: "c", text: "Camina" }, { id: "d", text: "Duerme" }], correcta: "b" },
    { titulo: "Nivel 14: Reutilizar", instruccion: "¿Para qué sirven las funciones?", contenido: "♻️", opciones: [{ id: "a", text: "Para escribir más código" }, { id: "b", text: "Para no repetir instrucciones" }, { id: "c", text: "Para confundir" }, { id: "d", text: "Para borrar datos" }], correcta: "b" },
    { titulo: "Nivel 14: Llamada", instruccion: "Si escribes 'Atacar()', el personaje:", contenido: "⚔️", opciones: [{ id: "a", text: "Se queda quieto" }, { id: "b", text: "Realiza el ataque" }, { id: "c", text: "Defiende" }, { id: "d", text: "Huye" }], correcta: "b" },
    { titulo: "Nivel 14: Parámetros", instruccion: "Función: Saludar(Nombre). Si digo Saludar('Ana')", contenido: "👋", opciones: [{ id: "a", text: "Dice 'Hola Pepe'" }, { id: "b", text: "Dice 'Hola Ana'" }, { id: "c", text: "Dice 'Adiós'" }, { id: "d", text: "No dice nada" }], correcta: "b" },
    { titulo: "Nivel 14: Receta", instruccion: "Función HacerPastel(). Adentro tiene 20 pasos.", contenido: "🎂", opciones: [{ id: "a", text: "Tengo que escribir los 20 pasos siempre" }, { id: "b", text: "Solo llamo HacerPastel() y listo" }, { id: "c", text: "No hago pastel" }, { id: "d", text: "Compro pan" }], correcta: "b" }
  ],

  // --- NIVEL 15: EVENTOS COMPLEJOS ---
  15: [
    { titulo: "Nivel 15: Eventos", instruccion: "SI toco la pantalla MIENTRAS salto:", contenido: "📱 + 🦘", opciones: [{ id: "a", text: "Doble Salto / Vuelo" }, { id: "b", text: "Caigo rápido" }, { id: "c", text: "Me detengo" }, { id: "d", text: "Nada" }], correcta: "a" },
    { titulo: "Nivel 15: Juego", instruccion: "Al chocar con enemigo:", contenido: "💥 Enemigo", opciones: [{ id: "a", text: "Pierdo vida" }, { id: "b", text: "Gano puntos" }, { id: "c", text: "Me hago amigo" }, { id: "d", text: "El enemigo crece" }], correcta: "a" },
    { titulo: "Nivel 15: Temporizador", instruccion: "Cuando el tiempo llega a 0:", contenido: "⏰ 00:00", opciones: [{ id: "a", text: "Juego empieza" }, { id: "b", text: "Game Over o Fin" }, { id: "c", text: "Gano tiempo" }, { id: "d", text: "Pausa" }], correcta: "b" },
    { titulo: "Nivel 15: Teclado", instruccion: "Al soltar la tecla 'Avanzar':", contenido: "⌨️ ⬆️ (Soltar)", opciones: [{ id: "a", text: "Sigo corriendo" }, { id: "b", text: "El personaje se detiene" }, { id: "c", text: "Salta" }, { id: "d", text: "Gira" }], correcta: "b" },
    { titulo: "Nivel 15: Mensaje", instruccion: "Al recibir un mensaje nuevo:", contenido: "📩", opciones: [{ id: "a", text: "Suena notificación" }, { id: "b", text: "Se borra el celular" }, { id: "c", text: "Se envía solo" }, { id: "d", text: "Se apaga" }], correcta: "a" }
  ],

  // --- NIVEL 16: COORDENADAS ---
  16: [
    { titulo: "Nivel 16: Coordenadas", instruccion: "X es horizontal, Y es vertical. Ir a (0, 10)", contenido: "📍 (X, Y)", opciones: [{ id: "a", text: "Moverse a la derecha" }, { id: "b", text: "Moverse hacia Arriba" }, { id: "c", text: "Quedarse en el centro" }, { id: "d", text: "Ir abajo" }], correcta: "b" },
    { titulo: "Nivel 16: Ejes", instruccion: "Si X aumenta (+), ¿a dónde vas?", contenido: "➡️ X+", opciones: [{ id: "a", text: "Derecha" }, { id: "b", text: "Izquierda" }, { id: "c", text: "Arriba" }, { id: "d", text: "Abajo" }], correcta: "a" },
    { titulo: "Nivel 16: Ejes", instruccion: "Si Y disminuye (-), ¿a dónde vas?", contenido: "⬇️ Y-", opciones: [{ id: "a", text: "Arriba" }, { id: "b", text: "Abajo" }, { id: "c", text: "Derecha" }, { id: "d", text: "Izquierda" }], correcta: "b" },
    { titulo: "Nivel 16: Posición", instruccion: "Estás en (5, 5). Caminas a (10, 5).", contenido: "🚶", opciones: [{ id: "a", text: "Me moví en Y (Vertical)" }, { id: "b", text: "Me moví en X (Horizontal)" }, { id: "c", text: "No me moví" }, { id: "d", text: "Salté" }], correcta: "b" },
    { titulo: "Nivel 16: Centro", instruccion: "¿Cuál es el origen o centro?", contenido: "🎯", opciones: [{ id: "a", text: "(100, 100)" }, { id: "b", text: "(0, 0)" }, { id: "c", text: "(1, 1)" }, { id: "d", text: "(50, 50)" }], correcta: "b" }
  ],

  // --- NIVEL 17: LISTAS / ARRAYS ---
  17: [
    { titulo: "Nivel 17: Listas", instruccion: "Lista = ['Manzana', 'Pera', 'Uva']. Posición 1 es:", contenido: "🔢 (Recuerda: Informática empieza en 0)", opciones: [{ id: "a", text: "Manzana" }, { id: "b", text: "Pera" }, { id: "c", text: "Uva" }, { id: "d", text: "Nada" }], correcta: "b" },
    { titulo: "Nivel 17: Agregar", instruccion: "Tengo ['A', 'B']. Agrego 'C' al final.", contenido: "📥 Push", opciones: [{ id: "a", text: "['C', 'A', 'B']" }, { id: "b", text: "['A', 'B', 'C']" }, { id: "c", text: "['A', 'C']" }, { id: "d", text: "['C']" }], correcta: "b" },
    { titulo: "Nivel 17: Tamaño", instruccion: "Lista = [10, 20, 30, 40]. ¿Cuál es su tamaño (Length)?", contenido: "📏", opciones: [{ id: "a", text: "3" }, { id: "b", text: "4" }, { id: "c", text: "10" }, { id: "d", text: "40" }], correcta: "b" },
    { titulo: "Nivel 17: Vacía", instruccion: "Mochila = []. ¿Qué hay dentro?", contenido: "🎒", opciones: [{ id: "a", text: "Aire" }, { id: "b", text: "Nada (Vacía)" }, { id: "c", text: "0" }, { id: "d", text: "Basura" }], correcta: "b" },
    { titulo: "Nivel 17: Buscar", instruccion: "¿En qué posición está el 5? [2, 8, 5, 1]", contenido: "🔍 Índice", opciones: [{ id: "a", text: "Posición 0" }, { id: "b", text: "Posición 2" }, { id: "c", text: "Posición 3" }, { id: "d", text: "Posición 1" }], correcta: "b" }
  ],

  // --- NIVEL 18: BÚSQUEDA ---
  18: [
    { titulo: "Nivel 18: Búsqueda", instruccion: "¿Cómo encuentras un nombre en una lista desordenada?", contenido: "📄 [Juan, Ana, Pedro...]", opciones: [{ id: "a", text: "Miro el primero y adivino" }, { id: "b", text: "Reviso uno por uno hasta hallarlo" }, { id: "c", text: "Rompo la lista" }, { id: "d", text: "Llamo a mi mamá" }], correcta: "b" },
    { titulo: "Nivel 18: Ordenar", instruccion: "Para buscar más rápido en un diccionario, ¿qué ayuda?", contenido: "📚 A-Z", opciones: [{ id: "a", text: "Que esté ordenado alfabéticamente" }, { id: "b", text: "Que tenga dibujos" }, { id: "c", text: "Que sea rojo" }, { id: "d", text: "Que esté roto" }], correcta: "a" },
    { titulo: "Nivel 18: Máximo", instruccion: "Buscar el número más grande: [5, 2, 9, 1]", contenido: "🔝", opciones: [{ id: "a", text: "Es el 5" }, { id: "b", text: "Comparo todos y gana el 9" }, { id: "c", text: "Es el 1" }, { id: "d", text: "Es el 2" }], correcta: "b" },
    { titulo: "Nivel 18: Binaria", instruccion: "Adivina un número (1-100). Te digo 'Es Menor'.", contenido: "🤔 ¿Qué haces?", opciones: [{ id: "a", text: "Busco en los números de abajo" }, { id: "b", text: "Busco en los de arriba" }, { id: "c", text: "Digo 100" }, { id: "d", text: "Me rindo" }], correcta: "a" },
    { titulo: "Nivel 18: Eficiencia", instruccion: "Un buen algoritmo...", contenido: "⚡", opciones: [{ id: "a", text: "Es muy lento" }, { id: "b", text: "Resuelve el problema rápido y bien" }, { id: "c", text: "Gasta mucha batería" }, { id: "d", text: "Es complicado" }], correcta: "b" }
  ],

  // --- NIVEL 19: BINARIO ---
  19: [
    { titulo: "Nivel 19: Binario", instruccion: "Las computadoras solo entienden:", contenido: "0️⃣1️⃣", opciones: [{ id: "a", text: "Palabras" }, { id: "b", text: "Ceros y Unos (Encendido/Apagado)" }, { id: "c", text: "Emojis" }, { id: "d", text: "Dibujos" }], correcta: "b" },
    { titulo: "Nivel 19: Bit", instruccion: "Un 1 significa:", contenido: "💡", opciones: [{ id: "a", text: "Apagado (Off)" }, { id: "b", text: "Encendido (On)" }, { id: "c", text: "Roto" }, { id: "d", text: "Frío" }], correcta: "b" },
    { titulo: "Nivel 19: Byte", instruccion: "8 Bits forman un...", contenido: "📦 01010101", opciones: [{ id: "a", text: "Mega" }, { id: "b", text: "Byte" }, { id: "c", text: "Pixel" }, { id: "d", text: "Kilo" }], correcta: "b" },
    { titulo: "Nivel 19: Imagen", instruccion: "Una foto digital está hecha de:", contenido: "🖼️", opciones: [{ id: "a", text: "Pintura real" }, { id: "b", text: "Millones de puntitos (Pixeles)" }, { id: "c", text: "Papel" }, { id: "d", text: "Magia" }], correcta: "b" },
    { titulo: "Nivel 19: Apagado", instruccion: "Un 0 significa:", contenido: "🌑", opciones: [{ id: "a", text: "Encendido" }, { id: "b", text: "Apagado (Off)" }, { id: "c", text: "Rápido" }, { id: "d", text: "Caliente" }], correcta: "b" }
  ],

  // --- NIVEL 20: EXPERTO ---
  20: [
    { titulo: "Nivel 20: Experto", instruccion: "Para hacer un videojuego necesitas:", contenido: "🎮", opciones: [{ id: "a", text: "Solo dibujos" }, { id: "b", text: "Lógica, Bucles, Variables y Eventos" }, { id: "c", text: "Solo música" }, { id: "d", text: "Suerte" }], correcta: "b" },
    { titulo: "Nivel 20: Robot", instruccion: "Tu robot debe limpiar la casa. Usas:", contenido: "🧹", opciones: [{ id: "a", text: "Un bucle 'Por cada cuarto: Limpiar'" }, { id: "b", text: "Le gritas" }, { id: "c", text: "Lo empujas" }, { id: "d", text: "Esperas" }], correcta: "a" },
    { titulo: "Nivel 20: Calculadora", instruccion: "App de suma. Usas:", contenido: "➕", opciones: [{ id: "a", text: "Variables (Num1, Num2) y Función Sumar" }, { id: "b", text: "Solo colores" }, { id: "c", text: "Un mapa" }, { id: "d", text: "Un video" }], correcta: "a" },
    { titulo: "Nivel 20: Internet", instruccion: "¿Cómo viaja un mensaje de WhatsApp?", contenido: "🌍", opciones: [{ id: "a", text: "Por una paloma" }, { id: "b", text: "Como datos digitales por la red" }, { id: "c", text: "Teletransportación" }, { id: "d", text: "Gritando" }], correcta: "b" },
    { titulo: "Nivel 20: Graduación", instruccion: "¡Eres Programador! Tu superpoder es:", contenido: "🎓", opciones: [{ id: "a", text: "Volar" }, { id: "b", text: "Resolver problemas usando lógica" }, { id: "c", text: "Ser invisible" }, { id: "d", text: "Correr rápido" }], correcta: "b" }
  ]
};

export default function QuizEngine({ alCerrar, alCompletar, alPerder, nivelId = 1 }) {
  // Estado para guardar la pregunta seleccionada aleatoriamente
  const [preguntaActual, setPreguntaActual] = useState(null);
  
  // EFECTO: Se ejecuta cada vez que cambia el nivel
  useEffect(() => {
    // 1. Obtenemos el "pool" (lista de 5 preguntas) del nivel actual
    const pool = QUESTIONS_DB[nivelId] || QUESTIONS_DB[1];
    // 2. Elegimos un número al azar entre 0 y 4
    const randomIndex = Math.floor(Math.random() * pool.length);
    // 3. Guardamos esa pregunta específica
    setPreguntaActual(pool[randomIndex]);
  }, [nivelId]);
  
  const [seleccion, setSeleccion] = useState(null);
  const [estado, setEstado] = useState("pendiente"); // pendiente, correcto, error_intento, derrota
  const [vidas, setVidas] = useState(3); 

  const comprobarRespuesta = () => {
    if (!seleccion || estado === 'correcto' || estado === 'derrota' || !preguntaActual) return;

    if (seleccion === preguntaActual.correcta) {
      setEstado("correcto");
      audio.playSfx('success');
    } else {
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      audio.playSfx('error');
      
      if (nuevasVidas > 0) {
        setEstado("error_intento");
        setTimeout(() => {
            setEstado("pendiente");
            setSeleccion(null); 
        }, 1500);
      } else {
        setEstado("derrota");
      }
    }
  };

  // Función "INTENTAR DE NUEVO"
  const handleReintentar = () => {
      // 1. Ejecutar castigo (si existe la función)
      if (alPerder) alPerder();
      
      // 2. REINICIAR EL NIVEL CON OTRA PREGUNTA
      const pool = QUESTIONS_DB[nivelId] || QUESTIONS_DB[1];
      const randomIndex = Math.floor(Math.random() * pool.length); // Nueva elección aleatoria
      setPreguntaActual(pool[randomIndex]);
      
      // 3. Resetear estados
      setVidas(3);
      setEstado("pendiente");
      setSeleccion(null);
  };

  if (!preguntaActual) return <div className="quiz-container" style={{display:'flex',justifyContent:'center',alignItems:'center',color:'white'}}>Cargando...</div>;

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <button className="btn-cerrar" onClick={alCerrar}><X size={32} color="#aaa" /></button>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#ff4b4b', fontWeight: '800', fontSize: '22px' }}>
            <Heart fill={vidas > 0 ? "#ff4b4b" : "none"} size={30} /> {vidas}
        </div>
      </div>

      {/* Contenido */}
      <div className="quiz-contenido">
        {estado === 'derrota' ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                <div style={{ background: 'rgba(255, 75, 75, 0.2)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Frown size={60} color="#ff4b4b" />
                </div>
                <h2 style={{ color: '#ff4b4b' }}>¡Oh no!</h2>
                <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '20px' }}>Te has quedado sin vidas.<br/><span style={{ fontSize: '14px' }}>(-1 Racha, -20 Gemas)</span></p>
                <p style={{ color: 'white', marginBottom: '30px' }}>Intenta de nuevo con otra pregunta.</p>
            </motion.div>
        ) : (
            <>
                <h2 className="quiz-titulo">{preguntaActual.titulo}</h2>
                <p className="quiz-instruccion">{preguntaActual.instruccion}</p>
                <div className="quiz-visual"><span>{preguntaActual.contenido}</span></div>
                <div className="quiz-opciones">
                {preguntaActual.opciones.map((op, index) => {
                    let clase = "";
                    if (seleccion === op.id) clase = "seleccionada";
                    if (estado === 'correcto' && op.id === preguntaActual.correcta) clase = "correcta-verde";
                    if (estado === 'error_intento' && seleccion === op.id) clase = "error";
                    return (
                        <motion.div key={op.id} whileTap={{ scale: 0.98 }} className={`opcion-card ${clase}`} onClick={() => { if (estado === 'pendiente') { setSeleccion(op.id); audio.playSfx('click'); } }}>
                            <div className="letra-opcion">{index + 1}</div>
                            <div className="texto-opcion">{op.text}</div>
                        </motion.div>
                    )
                })}
                </div>
            </>
        )}
      </div>

      {/* Footer */}
      <div className={`quiz-footer ${estado === 'derrota' || estado === 'error_intento' ? 'error' : (estado === 'correcto' ? 'correcto' : '')}`}>
        <div className="mensaje-feedback">
          {estado === 'correcto' && <div className="feedback-content exito"><CheckCircle size={40} fill="#58cc02" color="white" /><div><h3>¡Correcto!</h3></div></div>}
          {estado === 'error_intento' && <div className="feedback-content error"><AlertCircle size={40} fill="#ff4b4b" color="white" /><div><h3>¡Incorrecto!</h3></div></div>}
          {estado === 'derrota' && <div className="feedback-content error"><RefreshCw size={40} color="white" /><div><h3>Fin del juego</h3></div></div>}
        </div>

        {estado === 'correcto' && <button className="btn-comprobar correcto" onClick={() => alCompletar(true)}>CONTINUAR</button>}
        {estado === 'derrota' && <button className="btn-comprobar error" onClick={handleReintentar} style={{background:'#ff4b4b'}}>REINTENTAR</button>}
        {(estado === 'pendiente' || estado === 'error_intento') && <button className={`btn-comprobar ${estado==='error_intento'?'error':''}`} onClick={comprobarRespuesta} disabled={estado === 'error_intento'}>COMPROBAR</button>}
      </div>
    </div>
  );
}