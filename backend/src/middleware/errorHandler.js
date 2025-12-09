function errorHandler(err, req, res, next) {
  // Manejo centralizado de errores para no exponer detalles sensibles
  console.error('Unhandled error', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
}

module.exports = { errorHandler };
