const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

// Secret key untuk JWT (harus diubah di lingkungan yang lebih aman, misalnya variabel lingkungan)
const JWT_SECRET = 'your_secret_key_here';

// Register Controller
const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Validasi input
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    // Cek apakah email sudah terdaftar
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Membuat user baru
    const newUser = await User.create({ 
      email, 
      password,
      name: username // menggunakan username sebagai name
    });

    // Buat JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User berhasil didaftarkan', 
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Gagal mendaftar: ' + error.message });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Verifikasi password
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login berhasil', 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Gagal login: ' + error.message });
  }
};

// Logout Controller
const logoutUser = (req, res) => {
  // Di JWT, tidak ada sesi yang harus dihapus, cukup tidak kirim token lagi
  res.json({ message: 'Logout berhasil' });
};

module.exports = { registerUser, loginUser, logoutUser };
