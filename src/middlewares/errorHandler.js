const { normalizeError } = require('../utils/errors');

function notFound(req, res, next) {
  res.status(404).json({ success: false, error: 'Not Found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  const { status, response } = normalizeError(err);

  res.status(status).json(response);
}

module.exports = { notFound, errorHandler };
