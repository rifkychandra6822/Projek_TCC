const { Sequelize } = require('sequelize');

// Konfigurasi koneksi database
const sequelize = new Sequelize('pokemon_db', 'root', '', {
    host: '35.202.212.232',
    dialect: 'mysql',  // Ganti dengan 'postgres', 'sqlite', atau 'mssql' jika menggunakan database lain
    logging: false  // Matikan log query untuk menghindari tampilan log yang berlebihan
});

module.exports = sequelize;
