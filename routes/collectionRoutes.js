const express = require('express');
const { addPokemonToCollection } = require('../controllers/collectionController.js');
const router = express.Router();

// Mendefinisikan route untuk menambahkan Pokémon ke koleksi
router.post('/add', addPokemonToCollection);

module.exports = router;
