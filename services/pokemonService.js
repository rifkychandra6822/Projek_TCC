const fetch = require('node-fetch');
const Pokemon = require('../models/Pokemon.js');

// Function to get Pokemon data from PokeAPI and store it in the database
const getPokemonData = async (pokemonName) => {
  try {
    // Fetch Pokémon data from PokeAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
    const data = await response.json();

    // Create a new Pokemon object
    const pokemon = new Pokemon({
      name: data.name,
      base_experience: data.base_experience,
      height: data.height,
      weight: data.weight
    });

    // Save the Pokemon data to the database
    await pokemon.save();

    return data;
  } catch (error) {
    console.error("Error fetching or saving Pokemon data: ", error);
    throw new Error('Error fetching or saving Pokemon data');
  }
};

module.exports = { getPokemonData };
