const Joi = require('joi');

const userSchema = Joi.object({
  nom: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le nom est obligatoire',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est obligatoire'
  }),
  
  prenom: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le prénom est obligatoire',
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
    'string.max': 'Le prénom ne peut pas dépasser 100 caractères',
    'any.required': 'Le prénom est obligatoire'
  }),
  
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez fournir un email valide',
    'string.empty': 'L\'email est obligatoire',
    'any.required': 'L\'email est obligatoire'
  }),
  
  password: Joi.string().min(6).when('$isUpdate', {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est obligatoire pour la création d\'utilisateur'
  }),
  
  confirmPassword: Joi.string().when('$isUpdate', {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'any.required': 'La confirmation du mot de passe est obligatoire',
    'string.empty': 'La confirmation du mot de passe est obligatoire'
  }).when('password', {
    is: Joi.exist(),
    then: Joi.string().valid(Joi.ref('password')).messages({
      'any.only': 'Les mots de passe ne correspondent pas'
    }),
    otherwise: Joi.optional()
  }),
  
  telephone: Joi.string().pattern(/^[0-9+\-\s()]*$/).allow('').messages({
    'string.pattern.base': 'Le numéro de téléphone n\'est pas valide'
  }),
  
  date_naissance: Joi.date().max('now').allow(null).messages({
    'date.max': 'La date de naissance ne peut pas être dans le futur'
  }),
  
  adresse: Joi.string().max(255).allow('').messages({
    'string.max': 'L\'adresse ne peut pas dépasser 255 caractères'
  }),
  
  ville: Joi.string().max(100).allow('').messages({
    'string.max': 'La ville ne peut pas dépasser 100 caractères'
  }),
  
  code_postal: Joi.string().pattern(/^[0-9]*$/).max(10).allow('').messages({
    'string.pattern.base': 'Le code postal ne doit contenir que des chiffres',
    'string.max': 'Le code postal ne peut pas dépasser 10 caractères'
  }),
  
  pays: Joi.string().max(100).allow('').messages({
    'string.max': 'Le pays ne peut pas dépasser 100 caractères'
  })
});

const validateUser = (req, res, next) => {
  // Déterminer si c'est une mise à jour (PUT) ou une création (POST)
  const isUpdate = req.method === 'PUT';
  
  const { error } = userSchema.validate(req.body, { 
    abortEarly: false,
    context: { isUpdate }
  });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessage
    });
  }
  
  next();
};

module.exports = validateUser;
