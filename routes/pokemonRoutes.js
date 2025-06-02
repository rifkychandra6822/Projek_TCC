const express = require('express');
const router = express.Router();
const {
  getAllPokemon,
  getPokemonById,
  addPokemon,
  updatePokemon,
  deletePokemon,
  searchPokemon
} = require('../controllers/pokemonController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/search', searchPokemon);

// Protected routes
router.use(verifyToken);
router.get('/', getAllPokemon);
router.get('/:id', getPokemonById);
router.post('/', addPokemon);
router.put('/:id', updatePokemon);
router.delete('/:id', deletePokemon);

module.exports = router;
