const { getPokemonData } = require('../services/pokemonService.js');
const { Pokemon } = require('../models');
const fetch = require('node-fetch');

// Fungsi untuk mendapatkan data Pokémon
const getPokemon = async (req, res) => {
  const pokemonName = req.params.name; // Ambil nama Pokémon dari parameter URL
  try {
    // Panggil service untuk mendapatkan data Pokémon
    const pokemonData = await getPokemonData(pokemonName);
    res.json(pokemonData);  // Kirim data Pokémon ke pengguna
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    res.status(500).json({ error: 'Failed to fetch Pokémon data' });
  }
};

// Get all Pokemon from user's collection
const getAllPokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.findAll({
      where: { userId: req.user.id }
    });

    // Transform the data to ensure stats and abilities are parsed JSON
    const transformedPokemons = pokemons.map(pokemon => {
      const pokemonData = pokemon.get({ plain: true });
      return {
        ...pokemonData,
        stats: typeof pokemonData.stats === 'string' ? JSON.parse(pokemonData.stats) : pokemonData.stats,
        abilities: typeof pokemonData.abilities === 'string' ? JSON.parse(pokemonData.abilities) : pokemonData.abilities
      };
    });

    res.json(transformedPokemons);
  } catch (error) {
    console.error('Error getting Pokemon:', error);
    res.status(500).json({ message: 'Gagal mengambil data Pokemon' });
  }
};

// Get Pokemon by ID from collection
const getPokemonById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon tidak ditemukan' });
    }

    res.json(pokemon);
  } catch (error) {
    console.error('Error getting Pokemon:', error);
    res.status(500).json({ message: 'Gagal mengambil data Pokemon' });
  }
};

// Create new Pokemon
const createPokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.create(req.body);
    res.status(201).json(pokemon);
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    res.status(500).json({ message: 'Gagal membuat Pokemon baru' });
  }
};

// Update Pokemon in collection
const updatePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon tidak ditemukan' });
    }

    await pokemon.update(req.body);
    res.json(pokemon);
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    res.status(500).json({ message: 'Gagal mengupdate Pokemon' });
  }
};

// Delete Pokemon from collection
const deletePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon tidak ditemukan' });
    }

    await pokemon.destroy();
    res.json({ message: 'Pokemon berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    res.status(500).json({ message: 'Gagal menghapus Pokemon' });
  }
};

// Add Pokemon to collection
const addPokemon = async (req, res) => {
  try {
    const { name, image, type, level, baseExperience, height, weight, abilities, stats } = req.body;

    // Validasi input
    if (!name || !image || !type) {
      return res.status(400).json({ message: 'Nama, gambar, dan tipe Pokemon harus diisi' });
    }

    // Cek apakah Pokemon sudah ada di koleksi user
    const existingPokemon = await Pokemon.findOne({
      where: {
        name: name,
        userId: req.user.id
      }
    });

    if (existingPokemon) {
      return res.status(400).json({ message: 'Pokemon sudah ada dalam koleksi Anda' });
    }

    // Create Pokemon with complete data
    const pokemon = await Pokemon.create({
      name,
      image,
      type,
      level: level || 1,
      baseExperience,
      height,
      weight,
      abilities,
      stats,
      userId: req.user.id
    });

    res.status(201).json(pokemon);
  } catch (error) {
    console.error('Error adding Pokemon:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Data Pokemon tidak valid: ' + error.message });
    }
    res.status(500).json({ message: 'Gagal menambahkan Pokemon: ' + error.message });
  }
};

// Level Up Pokemon
const levelUpPokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon tidak ditemukan' });
    }

    pokemon.level += 1;
    await pokemon.save();

    res.json(pokemon);
  } catch (error) {
    console.error('Error leveling up Pokemon:', error);
    res.status(500).json({ message: 'Gagal menaikkan level Pokemon' });
  }
};

// Search Pokemon from PokeAPI
const searchPokemon = async (req, res) => {
  try {
    const { name } = req.query;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    
    if (!response.ok) {
      return res.status(404).json({ message: 'Pokemon tidak ditemukan di PokeAPI' });
    }

    const data = await response.json();
    const pokemon = {
      name: data.name,
      image: data.sprites.front_default,
      type: data.types[0].type.name,
      baseExperience: data.base_experience,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map(a => ({
        name: a.ability.name,
        isHidden: a.is_hidden
      })),
      stats: data.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
      }))
    };

    res.json(pokemon);
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    res.status(500).json({ message: 'Gagal mencari Pokemon' });
  }
};

module.exports = {
  getPokemon,
  getAllPokemon,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
  addPokemon,
  levelUpPokemon,
  searchPokemon
};
