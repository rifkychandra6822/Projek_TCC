const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Ensure sequelize is imported

class Collection extends Sequelize.Model {
  static init(sequelize) {
    super.init({
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      pokemonId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      collectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW  // Use Sequelize.NOW for default value
      }
    }, {
      sequelize,
      modelName: 'Collection',
    });
  }
}

module.exports = Collection;
