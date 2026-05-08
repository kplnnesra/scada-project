const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
});

pool.connect((err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
  } else {
    console.log('PostgreSQL bağlantısı başarılı!');
  }
});

module.exports = pool;