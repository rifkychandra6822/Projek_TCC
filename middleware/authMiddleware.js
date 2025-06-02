const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key_here';

// Middleware untuk memverifikasi token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan, silakan login' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Menyimpan informasi pengguna yang terdekripsi dalam request
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Token tidak valid' });
  }
};

module.exports = { verifyToken };
