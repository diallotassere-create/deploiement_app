const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('../models/User');
const validateUser = require('../middleware/userValidation');
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');

// Schéma de validation pour le changement de mot de passe par admin
const adminPasswordChangeSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le nouveau mot de passe est obligatoire'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Les mots de passe ne correspondent pas',
    'any.required': 'La confirmation du mot de passe est obligatoire'
  })
});

const userRoutes = (db) => {
  const userModel = new User(db);

  // Lister tous les utilisateurs (admin uniquement)
  router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await userModel.getAll();
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Obtenir un utilisateur spécifique (admin ou propriétaire)
  router.get('/:id', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
    try {
      const user = await userModel.getById(req.params.id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      if (error.message.includes('non trouvé')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Créer un utilisateur (admin uniquement)
  router.post('/', authenticateToken, requireAdmin, validateUser, async (req, res) => {
    try {
      const user = await userModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // Mettre à jour un utilisateur (admin ou propriétaire)
  router.put('/:id', authenticateToken, requireOwnershipOrAdmin, validateUser, async (req, res) => {
    try {
      const user = await userModel.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: user
      });
    } catch (error) {
      if (error.message.includes('non trouvé')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // Supprimer un utilisateur (admin uniquement)
  router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      await userModel.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      if (error.message.includes('non trouvé')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Changer le mot de passe d'un utilisateur (admin uniquement)
  router.put('/:id/password', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { error } = adminPasswordChangeSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => detail.message).join(', ')
        });
      }

      const { newPassword } = req.body;
      
      await userModel.changePasswordByAdmin(req.params.id, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Mot de passe changé avec succès'
      });
    } catch (error) {
      if (error.message.includes('non trouvé')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
};

module.exports = userRoutes;
