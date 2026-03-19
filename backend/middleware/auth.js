const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token d\'authentification requis'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }

    req.user = user;
    next();
  });
};

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé. Droits d\'administrateur requis'
    });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur peut accéder à ses propres données
const requireOwnershipOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id);
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isAdmin && currentUserId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé. Vous ne pouvez accéder qu\'à vos propres données'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin
};
