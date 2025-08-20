function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal Server Error'
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
}

module.exports = { notFoundHandler, errorHandler };

