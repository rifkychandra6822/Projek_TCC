'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Pokemons', [
      {
        name: 'Pikachu',
        base_experience: 112,
        height: 4,
        weight: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Charizard',
        base_experience: 240,
        height: 17,
        weight: 905,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bulbasaur',
        base_experience: 64,
        height: 7,
        weight: 69,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Pokemons', null, {});
  }
}; 