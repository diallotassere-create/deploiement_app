const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API User Management is running',
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  try {
    app.locals.db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'user_management',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL database');
    
    // Routes d'authentification (publiques)
    const authRoutes = require('./routes/auth')(app.locals.db);
    app.use('/api/auth', authRoutes);

    // Routes du profil utilisateur (protégées)
    const profileRoutes = require('./routes/profile')(app.locals.db);
    app.use('/api/profile', profileRoutes);

    // Routes des utilisateurs (protégées)
    const userRoutes = require('./routes/users')(app.locals.db);
    app.use('/api/users', userRoutes);

    app.use(errorHandler);

    app.use('*', (req, res) => {
      res.status(404).json({ 
        error: 'Route not found',
        message: `Route ${req.originalUrl} not found`
      });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`🔐 Auth endpoints at http://localhost:${PORT}/api/auth`);
      console.log(`👤 Profile endpoints at http://localhost:${PORT}/api/profile`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (app.locals.db) {
    await app.locals.db.end();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

startServer();
