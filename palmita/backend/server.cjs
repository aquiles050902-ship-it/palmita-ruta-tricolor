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
    database: 'palmita_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL (XAMPP)');
});

// --- RUTA 1: REGISTRO ---
app.post('/api/registro', (req, res) => {
    const { nombre, apellido, password, edad, genero, rol, email, cedula, codigoMaster } = req.body;
    
    // VALIDACIÓN DE SEGURIDAD PARA DIRECTOR / MASTER
    if (rol === 'master') {
        const CODIGO_SECRETO = "palmita@123"; 
        if (codigoMaster !== CODIGO_SECRETO) {
            return res.status(403).json({ error: "Código de Director incorrecto" });
        }
    }

    const gemas = 0, racha = 0, nivelCrecimiento = 0;
    const progresoNiveles = []; 
    const inventarioGafas = [0, 1];
    const inventarioSombreros = [0];
    const estadisticas = {}; // NUEVO: Objeto vacío para estadísticas

    const sql = `INSERT INTO usuarios 
    (nombre, apellido, password, edad, genero, rol, email, cedula, gemas, 
    racha, nivelCrecimiento, progresoNiveles, inventarioGafas, inventarioSombreros, estadisticas) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [
        nombre, apellido, password, edad, genero, rol, email, cedula, 
        gemas, racha, nivelCrecimiento, 
        JSON.stringify(progresoNiveles), 
        JSON.stringify(inventarioGafas), 
        JSON.stringify(inventarioSombreros),
        JSON.stringify(estadisticas) // NUEVO
    ];

    db.query(sql, valores, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario registrado', id: result.insertId, rol });
    });
});

// --- RUTA 2: LOGIN ---
app.post('/api/login', (req, res) => {
    const { identificador, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE (nombre = ? OR email = ?) AND password = ?';
    
    db.query(sql, [identificador, identificador, password], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            const user = results[0];
            try {
                user.progresoNiveles = JSON.parse(user.progresoNiveles || '[]'); 
                user.inventarioGafas = JSON.parse(user.inventarioGafas || '[0,1]');
                user.inventarioSombreros = JSON.parse(user.inventarioSombreros || '[0]');
                user.estadisticas = JSON.parse(user.estadisticas || '{}'); // NUEVO
                
                if (!Array.isArray(user.progresoNiveles)) user.progresoNiveles = [];
            } catch (e) {
                user.progresoNiveles = [];
                user.inventarioGafas = [0,1];
                user.inventarioSombreros = [0];
                user.estadisticas = {};
            }
            res.json(user);
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

// --- RUTA 3: GUARDAR PROGRESO ---
app.post('/api/guardar', (req, res) => {
    // NUEVO: Agregamos estadisticas al destructuring
    const { id, gemas, racha, nivelCrecimiento, gafasId, sombreroId, progresoNiveles, inventarioGafas, inventarioSombreros, estadisticas } = req.body;

    const sql = `UPDATE usuarios SET 
        gemas = ?, racha = ?, nivelCrecimiento = ?, gafasId = ?, sombreroId = ?, 
        progresoNiveles = ?, inventarioGafas = ?, inventarioSombreros = ?, estadisticas = ? 
        WHERE id = ?`;

    const valores = [
        gemas, racha, nivelCrecimiento, gafasId, sombreroId,
        JSON.stringify(progresoNiveles), 
        JSON.stringify(inventarioGafas), 
        JSON.stringify(inventarioSombreros),
        JSON.stringify(estadisticas || {}), // NUEVO
        id
    ];

    db.query(sql, valores, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Guardado' });
    });
});

// --- RUTA 4: OBTENER ESTUDIANTES ---
app.get('/api/estudiantes', (req, res) => {
    const sql = "SELECT * FROM usuarios WHERE rol = 'estudiante'";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const estudiantes = results.map(user => {
            let niveles = [];
            let stats = {}; // NUEVO
            try {
                niveles = JSON.parse(user.progresoNiveles || '[]');
                stats = JSON.parse(user.estadisticas || '{}'); // NUEVO
                if (!Array.isArray(niveles)) niveles = []; 
                if (typeof niveles === 'string') niveles = []; 
            } catch (e) { niveles = []; stats = {}; }
            
            const nivelesPrincipales = niveles.map(id => parseInt(id.split('-')[0])).filter(n => !isNaN(n));
            const maxNivel = nivelesPrincipales.length > 0 ? Math.max(...nivelesPrincipales) : 0;
            
            return {
                ...user,
                progresoNiveles: niveles,
                estadisticas: stats, // NUEVO: Enviamos el objeto parseado
                nivelMax: maxNivel
            };
        });
        res.json(estudiantes);
    });
});

// --- RUTA 5: OBTENER PROFESORES ---
app.get('/api/profesores', (req, res) => {
    const sql = "SELECT id, nombre, apellido, email, cedula, rol FROM usuarios WHERE rol = 'teacher'";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- RUTA 6: ELIMINAR USUARIO ---
app.delete('/api/estudiantes/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuario eliminado" });
    });
});

app.listen(3000, () => {
    console.log('🚀 Servidor Backend corriendo en http://localhost:3000');
});