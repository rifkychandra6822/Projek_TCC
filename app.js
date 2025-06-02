const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const berryRoutes = require('./routes/berryRoutes.js');
const pokemonRoutes = require('./routes/pokemonRoutes.js');
const { sequelize, User, Pokemon, Berry } = require('./models');
const { verifyToken } = require('./middleware/authMiddleware.js');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON with increased limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);         // Auth routes (register, login, logout)
app.use('/api/berries', verifyToken, berryRoutes);     // Berry data routes
app.use('/api/pokemon', verifyToken, pokemonRoutes);  // Pokémon data routes

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Sync Sequelize and start the server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Drop tables in correct order
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Pokemon.drop();
    await Berry.drop();
    await User.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create tables in correct order
    await User.sync();
    await Pokemon.sync();
    await Berry.sync();

    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();
