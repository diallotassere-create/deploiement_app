const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const router = express.Router();

// Schémas de validation
const registerSchema = Joi.object({
  nom: Joi.string().min(2).max(100).required(),
  prenom: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  telephone: Joi.string().pattern(/^[0-9+\-\s()]*$/).allow(''),
  date_naissance: Joi.date().max('now').allow(null),
  adresse: Joi.string().max(255).allow(''),
  ville: Joi.string().max(100).allow(''),
  code_postal: Joi.string().pattern(/^[0-9]*$/).max(10).allow(''),
  pays: Joi.string().max(100).allow('')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const authRoutes = (db) => {
  // Inscription
  router.post('/register', async (req, res) => {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => detail.message).join(', ')
        });
      }

      const { email, password, ...userData } = req.body;

      // Vérifier si l'email existe déjà
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cet email est déjà utilisé'
        });
      }

      // Hasher le mot de passe
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insérer le nouvel utilisateur
      const [result] = await db.execute(
        `INSERT INTO users (nom, prenom, email, password_hash, telephone, date_naissance, adresse, ville, code_postal, pays) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userData.nom, userData.prenom, email, passwordHash, userData.telephone, userData.date_naissance, userData.adresse, userData.ville, userData.code_postal, userData.pays]
      );

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id: result.insertId,
          email,
          nom: userData.nom,
          prenom: userData.prenom
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'inscription'
      });
    }
  });

  // Connexion
  router.post('/login', async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => detail.message).join(', ')
        });
      }

      const { email, password } = req.body;

      // Rechercher l'utilisateur
      const [users] = await db.execute(
        'SELECT id, nom, prenom, email, password_hash, role, is_active FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect'
        });
      }

      const user = users[0];

      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          error: 'Compte désactivé'
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect'
        });
      }

      // Créer le token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la connexion'
      });
    }
  });

  // Vérifier le token
  router.get('/verify', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token requis'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Récupérer les informations fraîches de l'utilisateur
      const [users] = await db.execute(
        'SELECT id, nom, prenom, email, role, is_active FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0 || !users[0].is_active) {
        return res.status(401).json({
          success: false,
          error: 'Utilisateur non trouvé ou désactivé'
        });
      }

      res.status(200).json({
        success: true,
        user: users[0]
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }
  });

  return router;
};

module.exports = authRoutes;
