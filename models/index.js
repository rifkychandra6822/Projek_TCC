const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

// Gunakan konfigurasi berdasarkan environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  }
);

// Import models
const User = require('./User');
const Pokemon = require('./Pokemon');
const Berry = require('./Berry');

// Initialize models
User.init(sequelize);
Pokemon.init(sequelize);
Berry.init(sequelize);

// Setup associations
User.hasMany(Pokemon, { foreignKey: 'userId' });
Pokemon.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Berry, { foreignKey: 'userId' });
Berry.belongsTo(User, { foreignKey: 'userId' });

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const models = {
  User,
  Pokemon,
  Berry,
  sequelize
};

module.exports = models;
