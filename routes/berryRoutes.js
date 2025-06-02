const express = require('express');
const router = express.Router();
const {
  getAllBerries,
  getBerryById,
  addBerry,
  updateBerry,
  deleteBerry,
  searchBerry
} = require('../controllers/berryController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/search', searchBerry);

// Protected routes
router.use(verifyToken);
router.get('/', getAllBerries);
router.get('/:id', getBerryById);
router.post('/', addBerry);
router.put('/:id', updateBerry);
router.delete('/:id', deleteBerry);

module.exports = router;
