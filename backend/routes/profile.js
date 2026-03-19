const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Schémas de validation
const updateProfileSchema = Joi.object({
  nom: Joi.string().min(2).max(100).required(),
  prenom: Joi.string().min(2).max(100).required(),
  telephone: Joi.string().pattern(/^[0-9+\-\s()]*$/).allow(''),
  date_naissance: Joi.date().max('now').allow(null),
  adresse: Joi.string().max(255).allow(''),
  ville: Joi.string().max(100).allow(''),
  code_postal: Joi.string().pattern(/^[0-9]*$/).max(10).allow(''),
  pays: Joi.string().max(100).allow('')
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Les mots de passe ne correspondent pas'
  })
});

const profileRoutes = (db) => {
  const User = require('../models/User');
  const userModel = new User(db);

  // Obtenir le profil de l'utilisateur connecté
  router.get('/me', authenticateToken, async (req, res) => {
    try {
      const user = await userModel.getById(req.user.id);
      
      // Ne pas renvoyer le hash du mot de passe
      const { password_hash, ...userProfile } = user;
      
      res.status(200).json({
        success: true,
        data: userProfile
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Mettre à jour le profil de l'utilisateur connecté
  router.put('/me', authenticateToken, async (req, res) => {
    try {
      const { error } = updateProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => detail.message).join(', ')
        });
      }

      const updatedUser = await userModel.updateProfile(req.user.id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: updatedUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // Changer le mot de passe
  router.put('/me/password', authenticateToken, async (req, res) => {
    try {
      const { error } = changePasswordSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => detail.message).join(', ')
        });
      }

      const { currentPassword, newPassword } = req.body;
      
      await userModel.changePassword(req.user.id, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Mot de passe changé avec succès'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
};

module.exports = profileRoutes;
