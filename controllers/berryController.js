const fetch = require('node-fetch');
const { Berry } = require('../models');

// Get all Berries from user's collection
const getAllBerries = async (req, res) => {
  try {
    const berries = await Berry.findAll({
      where: { userId: req.user.id }
    });
    res.json(berries);
  } catch (error) {
    console.error('Error getting Berries:', error);
    res.status(500).json({ message: 'Gagal mengambil data Berry' });
  }
};

// Get Berry by ID from collection
const getBerryById = async (req, res) => {
  try {
    const berry = await Berry.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!berry) {
      return res.status(404).json({ message: 'Berry tidak ditemukan' });
    }

    res.json(berry);
  } catch (error) {
    console.error('Error getting Berry:', error);
    res.status(500).json({ message: 'Gagal mengambil data Berry' });
  }
};

// Add Berry to collection
const addBerry = async (req, res) => {
  try {
    const { name, effect, image } = req.body;

    // Validasi input
    if (!name || !effect || !image) {
      return res.status(400).json({ message: 'Nama, efek, dan gambar Berry harus diisi' });
    }

    // Cek apakah Berry sudah ada di koleksi user
    const existingBerry = await Berry.findOne({
      where: {
        name: name,
        userId: req.user.id
      }
    });

    if (existingBerry) {
      return res.status(400).json({ message: 'Berry sudah ada dalam koleksi Anda' });
    }

    // Create Berry with complete data
    const berry = await Berry.create({
      name,
      effect,
      image,
      userId: req.user.id
    });

    res.status(201).json(berry);
  } catch (error) {
    console.error('Error adding Berry:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Data Berry tidak valid: ' + error.message });
    }
    res.status(500).json({ message: 'Gagal menambahkan Berry: ' + error.message });
  }
};

// Update Berry in collection
const updateBerry = async (req, res) => {
  try {
    const berry = await Berry.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!berry) {
      return res.status(404).json({ message: 'Berry tidak ditemukan' });
    }

    await berry.update(req.body);
    res.json(berry);
  } catch (error) {
    console.error('Error updating Berry:', error);
    res.status(500).json({ message: 'Gagal mengupdate Berry' });
  }
};

// Delete Berry from collection
const deleteBerry = async (req, res) => {
  try {
    const berry = await Berry.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!berry) {
      return res.status(404).json({ message: 'Berry tidak ditemukan' });
    }

    await berry.destroy();
    res.json({ message: 'Berry berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting Berry:', error);
    res.status(500).json({ message: 'Gagal menghapus Berry' });
  }
};

// Search Berry from PokeAPI
const searchBerry = async (req, res) => {
  try {
    const { name } = req.query;
    const response = await fetch(`https://pokeapi.co/api/v2/berry/${name.toLowerCase()}`);
    
    if (!response.ok) {
      return res.status(404).json({ message: 'Berry tidak ditemukan di PokeAPI' });
    }

    const data = await response.json();
    const flavorResponse = await fetch(data.flavors[0].flavor.url);
    const flavorData = await flavorResponse.json();

    const berry = {
      name: data.name,
      effect: flavorData.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berries/${data.name}-berry.png`
    };

    res.json(berry);
  } catch (error) {
    console.error('Error searching Berry:', error);
    res.status(500).json({ message: 'Gagal mencari Berry' });
  }
};

module.exports = {
  getAllBerries,
  getBerryById,
  addBerry,
  updateBerry,
  deleteBerry,
  searchBerry
};
