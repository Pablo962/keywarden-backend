const mysql = require('mysql2/promise');
require('dotenv').config(); 

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    const connection = await pool.getConnection();
    console.log(`¡Conectado exitosamente a la base de datos '${process.env.DB_NAME}'!`);
    connection.release(); // Devolver la conexión al pool
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection();

module.exports = pool;