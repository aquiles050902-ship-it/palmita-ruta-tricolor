-- Schema SQL para XAMPP/MySQL
-- Crea la base de datos y tablas para niños (estudiantes) y profesores
-- Instrucciones rápidas:
-- 1) Abre XAMPP, inicia MySQL y Apache.
-- 2) Entra a phpMyAdmin: http://localhost/phpmyadmin
-- 3) En la pestaña Importar, sube este archivo.
-- 4) Actualiza credenciales en tu backend PHP para conectarte a esta base de datos.

-- Configuración de juego de caracteres y collation recomendadas
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';

-- Crea base de datos si no existe
CREATE DATABASE IF NOT EXISTS palmita_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE palmita_db;

-- Tabla central de usuarios (niños y profesores)
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role ENUM('student','teacher') NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de perfil para estudiantes (niños)
CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  birthdate DATE NULL,
  grade VARCHAR(50) NULL,
  guardian_name VARCHAR(100) NULL,
  guardian_phone VARCHAR(30) NULL,
  additional_info JSON NULL,
  CONSTRAINT fk_students_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de perfil para profesores
CREATE TABLE IF NOT EXISTS teachers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  school VARCHAR(150) NULL,
  subject VARCHAR(100) NULL,
  additional_info JSON NULL,
  CONSTRAINT fk_teachers_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices adicionales
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_teachers_user ON teachers(user_id);

-- Usuario de ejemplo (profesor) - OPCIONAL: descomentar para crear uno de prueba
-- INSERT INTO users (role, name, email, password_hash)
-- VALUES ('teacher', 'Profesor Demo', 'profesor@demo.com',
--         -- Reemplaza por hash real generado con password_hash en PHP (PASSWORD_DEFAULT)
--         '$2y$10$ReemplazaEsteHashConUnoRealGeneradoEnPHPxxxxxxx');

-- Nota de seguridad:
-- - Nunca guardes contraseñas en texto plano. Usa password_hash() de PHP.
-- - Asegura el acceso remoto a MySQL deshabilitado o con firewall.
-- - Implementa controles de acceso (sesiones/JWT) en el backend.