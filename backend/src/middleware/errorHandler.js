const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
  });
};

module.exports = errorHandler;