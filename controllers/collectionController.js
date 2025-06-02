const Collection = require('../models/Collection.js');

// Fungsi untuk menambahkan Pokémon ke koleksi pengguna
const addPokemonToCollection = async (req, res) => {
  const { userId, pokemonId } = req.body; // Ambil userId dan pokemonId dari body request
  try {
    // Buat koleksi baru dan simpan ke database
    const newCollection = new Collection({
      userId: userId,
      pokemonId: pokemonId,
      collectedAt: new Date()
    });

    await newCollection.save();
    res.status(201).json({ message: 'Pokemon added to collection' });  // Kirim sukses ke pengguna
  } catch (error) {
    console.error("Error adding Pokemon to collection:", error);
    res.status(500).json({ error: 'Error adding Pokemon to collection' });
  }
};

module.exports = { addPokemonToCollection };
