const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.stack);

  if (err.code === 'ER_DUP_ENTRY') {
    const message = 'Cet email existe déjà';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    const message = 'Table non trouvée dans la base de données';
    error = { message, statusCode: 500 };
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
