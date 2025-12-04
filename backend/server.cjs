const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- CONEXIÓN A BASE DE DATOS XAMPP ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'palmita_db' // ¡Asegúrate de haber creado esta base de datos en phpMyAdmin!
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL (XAMPP)');
});

// --- RUTA 1: REGISTRO DE USUARIOS ---
app.post('/api/registro', (req, res) => {
    const { nombre, apellido, password, edad, genero, rol, email, cedula } = req.body;
    
    // Valores por defecto para el juego
    const gemas = 0, racha = 0, nivelCrecimiento = 0;
    const progresoNiveles = '[]';      // Array vacío como texto
    const inventarioGafas = '[0,1]';   // Gafas básicas
    const inventarioSombreros = '[0]'; // Sin sombrero

    const sql = `INSERT INTO usuarios 
    (nombre, apellido, password, edad, genero, rol, email, cedula, gemas, racha, nivelCrecimiento, progresoNiveles, inventarioGafas, inventarioSombreros) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [nombre, apellido, password, edad, genero, rol, email, cedula, gemas, racha, nivelCrecimiento, progresoNiveles, inventarioGafas, inventarioSombreros];

    db.query(sql, valores, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario registrado', id: result.insertId, rol });
    });
});

// --- RUTA 2: INICIO DE SESIÓN ---
app.post('/api/login', (req, res) => {
    const { identificador, password } = req.body; // 'identificador' puede ser nombre o email
    
    // Buscamos usuario por Nombre O por Email
    const sql = 'SELECT * FROM usuarios WHERE (nombre = ? OR email = ?) AND password = ?';
    
    db.query(sql, [identificador, identificador, password], (err, results) => {
        if (err) return res.status(500).json(err);
        
        if (results.length > 0) {
            const user = results[0];
            // Convertimos el texto JSON de la BD a Arrays reales de JS para que React los entienda
            user.progresoNiveles = JSON.parse(user.progresoNiveles || '[]');
            user.inventarioGafas = JSON.parse(user.inventarioGafas || '[0,1]');
            user.inventarioSombreros = JSON.parse(user.inventarioSombreros || '[0]');
            res.json(user);
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// --- RUTA 3: GUARDAR PROGRESO ---
app.post('/api/guardar', (req, res) => {
    const { id, gemas, racha, nivelCrecimiento, gafasId, sombreroId, progresoNiveles, inventarioGafas, inventarioSombreros } = req.body;

    // Convertimos los arrays de React a texto JSON para guardar en MySQL
    const sql = `UPDATE usuarios SET 
        gemas = ?, racha = ?, nivelCrecimiento = ?, gafasId = ?, sombreroId = ?, 
        progresoNiveles = ?, inventarioGafas = ?, inventarioSombreros = ? 
        WHERE id = ?`;

    const valores = [
        gemas, racha, nivelCrecimiento, gafasId, sombreroId,
        JSON.stringify(progresoNiveles), 
        JSON.stringify(inventarioGafas), 
        JSON.stringify(inventarioSombreros),
        id
    ];

    db.query(sql, valores, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Progreso guardado' });
    });
});

// Arrancar servidor
app.listen(3000, () => {
    console.log('🚀 Servidor Backend corriendo en http://localhost:3000');
});